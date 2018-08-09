<template>
  <div>
    <div class="vux-demo">
      <img class="logo" src="../assets/gongan.png">
      <h1>深圳E勘查</h1>
      <h2>{{myUnit}}</h2>
      <h2>{{myName}}</h2>
    </div>
    <grid>
      <grid-item label="录入案件" @click.native="onAddRec()">
        <img slot="icon" src="../assets/date_add.png">
      </grid-item>
      <grid-item label="查询案件" link="/RecordList">
        <img slot="icon" src="../assets/date_magnify.png">
      </grid-item>      
    </grid>
    <div v-transfer-dom >
      <popup v-model="showMenu" position="right" style="width:160px;background-color: #434343;height:340px;margin-top:45px"> 
        <group style="background-color: #434343;margin-top: -15px">
          <cell title="关于" class="menu-cell" link="/About" is-link>
            <img slot="icon" width="25" class="menu-cell-img" src="../assets/about.png" >
          </cell>
          <cell title="帮助文档" class="menu-cell" is-link>
            <img slot="icon" width="25" class="menu-cell-img" src="../assets/feedback.png">
          </cell>
          <cell title="问题反馈" class="menu-cell" is-link link="">
            <img slot="icon" width="25" class="menu-cell-img" src="../assets/question.png">
          </cell>
          <cell title="责任民警-崔志岗" class="menu-cell" is-link>
            <img slot="icon" width="25" class="menu-cell-img" src="../assets/police.png">
          </cell>
          <cell title="刷新" class="menu-cell" is-link @click.native="refreshPage">
            <img slot="icon" width="25" class="menu-cell-img" src="../assets/refresh.png">
          </cell>
          <cell title="退出" class="menu-cell" is-link @click.native="exitPage">
            <img slot="icon" width="25" class="menu-cell-img" src="../assets/back.png">
          </cell>
        </group>        
      </popup>
    </div>
  </div>
</template>

<script>
import { Group, XInput, XButton, Datetime, Grid, GridItem, Cell, Popup} from 'vux'
import { CLR_RECORDINFO, SET_BASEURL, SET_TOKEN, SET_BASEINFO, SET_UNITINFO, SET_USERLIST, SET_UNITLIST } from '../mutationTypes'
var uuid = require('node-uuid')

var exitFlag = false;
var appCode = "com.xinghuo.question";//问题反馈的appCode
  var know_appUrl = "modules/question/know_info.html";//帮助文档的路径
  var question_appUrl = "modules/question/work_order_form.html";//问题反馈的路径

  var mAppName = "深云E勘察";//本项目的名称
  //Dom结构加载完成后执行
  /*
  app.page.onReady = function() {
      //to do
  }

  app.page.onError = function(err) {
      //alert(JSON.stringify(err));
  }
  //页面所有元素加载完成后执行，deviceRready
  app.page.onLoad = function() {
      //后退键
      var flag = 0;
      
      document.addEventListener("backbutton", function() {
          var isIndexPage = ui.Page.history.length <= 1 ? true : false;

          //已在首页
          if (isIndexPage) {
              if (flag == 0) {
                  app.hint("再按一次就退出应用了!");
                  flag = flag + 1;
                  //5s后重新设置回去
                  setTimeout(function() {
                      flag = 0;
                  }, 5000);
              } else if (flag == 1) {
                  app.exit();
              }
          } else{
              //单页后退，多页不处理
              if(ui.settings.appType == 'single'){
                  ui.Page.back();
              }
          }


      }, false)      
  }  
*/
export default {
  components: {
    Group,
    XInput,
    Datetime,
    Grid,
    GridItem,
    XButton,
    Popup,
    Cell
  },
  computed: {
    myName: function () {
      return this.$store.getters.GetterMe.userName
    },
    myUnit: function () {
      return this.$store.getters.GetterMe.deptName
    }
  },
  mounted: function () {
    var token = ''
    let that = this
    let bUrl = 'http://182.61.43.29/webapi/'
    bUrl = 'http://172.29.3.76:9219/szga/'
    that.$store.commit(SET_BASEURL, bUrl)

    Cordova.exec(res => {
      token = res
      this.$store.commit(SET_TOKEN, res)
      //that.getInitInfo(res)
      //that.getLoginUserInfo(accessToken)
    },function (err) {
      alert("获取token失败")
    }, "LinkPlugin", "getToken", [])
    app.getLoginInfo(function(res){
      let ret = JSON.parse(res)
      let sendObj = {
        userId: ret.userId
      }

      app.getUserInfo(sendObj, function(res){
        alert(res)
        let ret = JSON.parse(res)
        let userInfo = {}

        userInfo.userCode = ret.userCode
        userInfo.userName = ret.userName
        userInfo.position = ret.position
        userInfo.departmentId = ret.departmentId
        userInfo.job = ret.Job
        userInfo.deptCode = ret.deptCode

        alert(JSON.stringify(userInfo))
        that.$store.commit(SET_BASEINFO, userInfo)
        that.getUnitInfo(token, userInfo.deptCode)
        that.getUnitList(token, userInfo.deptCode)
        that.getUserList(token, userInfo.deptCode)

      })
    },function(err){
      alert("err_"+err)
    })
    
  },
  methods: {
    getUnitInfo(token, deptCode) {
      let that = this
      that.$http({
        url: that.$store.getters.GetterBaseUrl+'xinghuo-apaas-useridentifyservice/services/api/v1/dept/info',
        method: 'Post',
        params: {
          deptCode: deptCode,
          hasChild: '0'
        },
        headers: {
          contentType: 'application/x-www-form-urlencoded',
          requestType:'app',
          AccessToken: token,
          ApplyID: this.$store.getters.GetterSysInfo.applyID,
          SecretKey: this.$store.getters.GetterSysInfo.secretKey
        }
      }).then(function (res) {
        alert(JSON.stringify(res))
        if(res.body.success){               
          that.$store.commit(SET_UNITINFO, res.body.obj.name)              
        }else{
          alert(res.data.msg)
        }
      })
    },
    getUnitList(token, deptCode) {
      let that = this
      that.$http({
        url: that.$store.getters.GetterBaseUrl+'xinghuo-apaas-useridentifyservice/services/api/v1/dept/list',
        method: 'Post',
        params: {
          deptCode: deptCode,
          hasChild: '1'
        },
        headers: {
          contentType: 'application/x-www-form-urlencoded',
          requestType:'app',
          AccessToken: token,
          ApplyID: this.$store.getters.GetterSysInfo.applyID,
          SecretKey: this.$store.getters.GetterSysInfo.secretKey
        }
      }).then(function (res) {
        alert(JSON.stringify(res))
        if(res.body.success){
          let deptList=[]
          res.body.obj.forEach(function(item){
            deptList.push(item.name)
          })
          alert(JSON.stringify(deptList))
          that.$store.commit(SET_UNITLIST, deptList)              
        }else{
          alert(res.body.msg)
        }
      })
    },
    getUserList(token, deptCode) {
      let that = this
      that.$http({
            url: that.$store.getters.GetterBaseUrl+'xinghuo-apaas-useridentifyservice/services/api/v1/user/list',
            method: 'Post',
            params: {
              deptCode: deptCode,
              hasChild: '1',
              pageNo: '1',
              pageSize: '100'
            },
            headers: {
              contentType: 'application/x-www-form-urlencoded',
              requestType:'app',
              AccessToken: token,
              ApplyID: this.$store.getters.GetterSysInfo.applyID,
              SecretKey: this.$store.getters.GetterSysInfo.secretKey
            }
          }).then(function (res) {
            alert(JSON.stringify(res))     
            if(res.body.success){
              let userList=[]
              res.body.obj.forEach(function(item){
                userList.push(item.userName)
              })
              alert(JSON.stringify(userList))
              that.$store.commit(SET_USERLIST, userList)            
            }else{
              alert(res.body.msg)
            }
        })
    },
    getInitInfo(token) {
      let that = this
      this.$http({
            url: that.$store.getters.GetterBaseUrl+'common/getInitInfo',
            method: 'Get',
            emulateJSON: true,
            headers: {
              contentType: 'application/x-www-form-urlencoded',
              requestType:'app',
              AccessToken:token,
              ApplyID: that.$store.getters.GetterSysInfo.applyID,
              SecretKey: that.$store.getters.GetterSysInfo.secretKey
            }
          }).then(function (res) {
            if(res.data.code == 604){
              console.log(res.data.data)
              that.$store.commit(SET_PRIVLIST, res.data.data.privList)
              that.$store.commit(SET_BASEINFO, res.data.data.userInfo)
              that.$store.commit(SET_USERLIST, res.data.data.userOptions)
              that.$store.commit(SET_UNITLIST, res.data.data.unitOptions)
            }else{
              that.$message({
                message: res.body.data,
                type: 'error'
              })
            }
        })
    },
    onAddRec () {
      alert(JSON.stringify(this.$store.getters.GetterUnitState))
      alert(JSON.stringify(this.$store.getters.GetterUserState))

      let date = new Date()
      let seperator1 = '-'
      let seperator2 = ':'
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      let hour = date.getHours()
      let minitue = date.getMinutes()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (hour >= 0 && hour <= 9) {
        hour = '0' + hour
      }
      if (minitue >= 0 && minitue <= 9) {
        minitue = '0' + minitue
      }
      let curDate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      let curTime = curDate + ' ' + hour + seperator2 + minitue
      
      let entity = {
        recordId: 0,
        uuid: uuid.v4(),
        recordNo: '',
        recordKyNo: '',
        recordJjNo: '',
        recordAjNo: '',
        kyrName: this.$store.getters.GetterMe.userName,
        kyUnitName: this.$store.getters.GetterMe.deptName,
        jjrName: this.$store.getters.GetterMe.userName,
        jjUnitName: this.$store.getters.GetterMe.deptName,
        kyUnitId: this.$store.getters.GetterMe.deptCode,
        bgrId: this.$store.getters.GetterMe.userCode,
        bgrName: this.$store.getters.GetterMe.userName,
        recTitle: '',
        recXz: '',
        fsqy: '',
        xcwz: '',
        xczb: '',
        recState: 1001,
        xctq: '晴',
        xcsd: '50%',
        xcwd: '20 ℃',
        kyDate: curDate,
        afTime: curDate + ' 00:00',
        jjTime: curDate + ' 00:00',
        kyksTime: curTime,
        kyjsTime: curTime,
        xcfx: '无',
        xcgz: '自然光',
        xczk: '原始现场',
        bhFlag: 0,
        bhrName: this.$store.getters.GetterMe.userName,
        bhrUnitName: this.$store.getters.GetterMe.deptName,
        bhrZw: this.$store.getters.GetterMe.position,
        bdyy: '',
        bhfs: '专人看护现场，防止他人进入',
        xcEast: '',
        xcWest: '',
        xcSouth: '',
        xcNorth: '',
        jzrName: '',
        jzrSex: '男',
        jzrBirth: '',
        jzrAddress: '',
        zhrName: this.$store.getters.GetterMe.userName,
        zhrUnitName: this.$store.getters.GetterMe.deptName,
        zhrZw: this.$store.getters.GetterMe.position,
        blrName: this.$store.getters.GetterMe.userName,
        ztrName: this.$store.getters.GetterMe.userName,
        zxrName: this.$store.getters.GetterMe.userName,
        lxrName: this.$store.getters.GetterMe.userName,
        lyrName: '',
        jjrOther: '',
        kysy: '',
        xcms: '',
        xctSrc: '',
        pmtSrc: '',
        qmtSrc: ''
      }
      this.$store.commit(CLR_RECORDINFO, entity)
      this.$router.push({name: 'Step1', query: {isAdd: '1', curStep: 1}})
    },
    refreshPage() {
      app.refresh()
    },
    exitPage() {
      app.exit()
    },
    //返回退出
    backFunc() {
      var isIndexPage = ui.Page.history.length <= 1 ? true : false;
      if(isIndexPage) {
        if(exitFlag) {
          app.exit();
        } else {
          exitFlag = true;
          app.hint("再次点击返回退出应用");
          setTimeout("exitFlag = false;", 3000);
        }
      } else {
        //单页后退，多页不处理
        if(ui.settings.appType == 'single') {
          ui.Page.back();
        }
      }
    },
    //跳转到about关于页面，about页面也直接仿照写
    openAboutInfo() {
      alert(111)
      ui.load({
        url: "about.html",
        params: {}
      });
    },

    //跳转到责任民警页面
    openResponpolice() {
      showOrHide();//隐藏popup框
      //先去问责任民警的警号，再找曹工获取这个userId.
      app.link.startUserCard("3caf2cf4-25f0-4dc8-8a8c-09bf4cc61644");//在应用市场搜索 框架3-->Link API示例-->通讯录-->找到这个民警-->即可看到userId

    },
    //跳转到帮助文档页面即常见问题列表页面
    runAppKnow(){
      //暂时跳这个页面,这个页面需要自己写
      ui.load({
        url: "support.html",
        params: {}
      });
      //以后跳下个页面
//        var params = {
//          appCode: appCode,
//          data: {
//            APP_NAME: APP_NAME
//          },
//          appUrl: know_appUrl
//        };
//        app.link.runApp(params);
    },
    //跳转到问题反馈页面，只需要把url.js，改了之后，下面代码直接复制
    runAppQuestion(){
      showOrHide();//隐藏popup框
      var params = {
        appCode: appCode,
        data:{
          isPages:"1",
          systemId:"GACLOUD",
          app_code: APP_NAME,
          appName:mAppName
        },
        appUrl:question_appUrl
      };
      app.link.runApp(params);
    }
  },
  data () {
    return {
      showMenu: false
    }
  }
}
</script>

<style>
</style>
