<template>
  <div>
    <group>
      <x-input title="案件名称" v-model="recTitle" text-align='right'></x-input>
      <x-input title="案件编号" v-model="recordAjNo" text-align='right'></x-input>
      <x-input title="接警编号" v-model="recordJjNo" text-align='right'></x-input>
      <x-input title="现场勘验号" v-model="recordKyNo" text-align='right'></x-input>
      <cell title="现场方位"  is-link @click.native="fetchXct" ></cell>
      <div v-show= "showsctdiv">
        <img src=""  id="xctImg" width="300" height="420" >
        <canvas id="xctCanvas" width="800" height="560" style="display:none" ></canvas>
        <flexbox>
          <flexbox-item>
            <x-button @click.native="xctUpload" type="primary" > 上传方位图 </x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="xctCancel" type="warn" > 取消选择 </x-button>
          </flexbox-item>
        </flexbox>
      </div>
      <cell title="现场平面"  is-link @click.native="fetchPmt" ></cell>
      <div v-show= "showpmtdiv">
        <img src=""  id="pmtImg" width="300" height="420" >
        <canvas id="pmtCanvas" width="800" height="560" style="display:none" ></canvas>
        <flexbox>
          <flexbox-item>
            <x-button @click.native="pmtUpload" type="primary" > 上传平面图 </x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="pmtCancel" type="warn" > 取消选择 </x-button>
          </flexbox-item>
        </flexbox>
      </div>

      <x-input title="发生区域" v-model="fsqy" text-align='right'></x-input>
      <x-input title="现场位置" v-model='xcwz' text-align='right'></x-input>      
      <popup-picker title="勘验单位" :data="unitList" v-model="kyUnitName"
        @on-show="onShow" @on-hide="onHide" @on-change="onChange" ></popup-picker>
      <x-input title="勘验人" v-model="kyrName" text-align="right"></x-input>
      <popup-picker title="勘验人" :data='userList' v-model="kyrName" ></popup-picker>
      <popup-picker title="接警人" :data='userList' v-model="jjrName" ></popup-picker>
      <x-input title="其他接警人" v-model='jjrOther' text-align='right'></x-input>
      <popup-picker title="接警单位" :data="unitList" v-model="jjUnitName" ></popup-picker>
      <datetime v-model="kyDate" title="勘验日期" confirm-text="完成" cancel-text="取消" format="YYYY-MM-DD" ></datetime>
      <datetime v-model="afTime" title="案发时间" confirm-text="完成" cancel-text="取消" format="YYYY-MM-DD HH:mm" ></datetime>
      <datetime v-model="jjTime" title="接警时间" confirm-text="完成" cancel-text="取消" format="YYYY-MM-DD HH:mm" ></datetime>
      <datetime v-model="kyksTime" title="勘验开始时间" confirm-text="完成" cancel-text="取消" format="YYYY-MM-DD HH:mm" ></datetime>
      <datetime v-model="kyjsTime" title="勘验结束时间" placeholder="不填则默认为提交时间" confirm-text="完成" cancel-text="取消" format="YYYY-MM-DD HH:mm" ></datetime>
      <popup-picker title="天气" :data='tqList' v-model="xctq" ></popup-picker>
      <popup-picker title="风向" :data='fxList' v-model="xcfx" ></popup-picker>
      <popup-picker title="温度" :data='wdList' v-model='xcwd' ></popup-picker>
      <popup-picker title="湿度" :data='sdList' v-model='xcsd' ></popup-picker>
      <cell title="光照" v-model="lightList" is-link @click.native="showPopup=true"></cell>
      <popup v-model="showPopup" class="checker-popup">
        <div style="padding:10px 10px 40px 10px;">
          <p style="padding: 5px 5px 5px 2px;color:#888;">光照情况</p>
          <checker
          v-model="lightList" type="checkbox"
          default-item-class="demo4-item"
          selected-item-class="demo4-item-selected"
          disabled-item-class="demo4-item-disabled">
            <checker-item value="自然光" >自然光</checker-item>
            <checker-item value="灯光" >灯光</checker-item>
            <checker-item value="特种光" >特种光</checker-item>
          </checker>
          <div style="padding: 15px;">
            <x-button @click.native="showPopup = false" plain type="primary"> 确  定 </x-button>
          </div>
        </div>
      </popup>
      <popup-picker title="现场状况" :data='zkList' v-model="xczk" ></popup-picker>
      <x-input title="变动原因" v-model='bdyy' text-align='right' v-show="showBdReason">
        <x-button slot="right" type="primary" mini @click.native="showBdyyPopup = true">></x-button>
      </x-input>
      <x-switch title="是否现场保护" v-model="bhFlag" ></x-switch>      
      <group v-if="bhFlag">
        <x-input title="保护人" v-model='bhrName' text-align='right'>
          <x-button slot="right" type="primary" mini @click.native="showBhrPopup = true">></x-button>
        </x-input>        
        <x-input title="保护人单位" v-model='bhrUnitName' text-align='right'>
          <x-button slot="right" type="primary" mini @click.native="showBhrUnitPopup = true">></x-button>
        </x-input>
        <x-input title="保护人职位" v-model='bhrZw' text-align='right'></x-input>
        <x-input title="保护方式" v-model='bhfs' text-align='right'>
          <x-button slot="right" type="primary" mini @click.native="showBhfsPopup = true">></x-button>
        </x-input>
      </group>
    </group>
    <popup v-model="showBhrPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='userList' v-model='bhrPickerName' @on-change='onChangeBhrName'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showBhrPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
    <popup v-model="showBhrUnitPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='unitList' v-model='bhrUnitPickerName' @on-change='onChangeBhrUnitName'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showBhrUnitPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
    <popup v-model="showBhfsPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='fsList' v-model='bhfsPicker' @on-change='onChangeBhfs'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showBhfsPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
    <popup v-model="showBdyyPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='bdList' v-model='bdyyPicker' @on-change='onChangeBdyy'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showBdyyPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
  </div>
</template>

<script>
import { Group, XInput, PopupPicker, Picker, Datetime, XTextarea, XAddress, ChinaAddressData, Cell, XSwitch, Checker, CheckerItem, Popup, XButton, Flexbox, FlexboxItem } from 'vux'
import { SET_RECORDBASE, SET_XCT, SET_RECORDFILES, SET_PMT } from '../../mutationTypes'
export default {
  components: {
    Group,
    XInput,
    Picker,
    Datetime,
    XTextarea,
    XAddress,
    ChinaAddressData,
    Cell,
    XSwitch,
    PopupPicker,
    Popup,
    Checker,
    CheckerItem,
    XButton,
    Flexbox,
    FlexboxItem
  },
  computed: {
    unitList: function () {
      return this.$store.getters.GetterUnitState
    },
    userList: function () {
      return this.$store.getters.GetterUserState
    },    
    showBdReason: function () {
      if (this.xczk[0] === '原始现场') {
        return false
      } else {
        return true
      }
    }
  },
  mounted: function () {
    this.isAdd = this.$route.query.isAdd
    if ((this.isAdd !== '1')) {
      this.$vux.loading.show({
        text: '读取文件列表'
      })
      this.getOriFiles()
    }    

    if (this.$store.getters.GetterEntity.bhFlag === 1) {
      this.bhFlag = true
    }
    if (this.$store.getters.GetterEntity.xcgz !== '') {
      this.lightList = this.$store.getters.GetterEntity.xcgz.split('+')
    }   

  },
  methods: {
    gerFileUrl (subStr) {
      var subStr = new RegExp('(\d+)\.(\d+)\.(\d+)\.(\d+)(:(\d+)|)')
      var result = url.replace(subStr, '172.29.3.76:9219')
    },
    getOriFiles () {
      let uuid = this.$store.getters.GetterEntity.uuid
      
      this.$http({
        url: this.$store.getters.GetterBaseUrl + 'pbsserver/uploadFiles/getRecordFileList',
        method: 'GET',
        emulateJSON: true,
        headers: {
          contentType: 'application/x-www-form-urlencoded',
          uuid: uuid,
          requestType:'app',
          AccessToken: this.$store.getters.GetterAccessToken,
          ApplyID: this.$store.getters.GetterSysInfo.applyID,
          SecretKey: this.$store.getters.GetterSysInfo.secretKey
        }
      }).then(function (res) {
        let ret = eval("(" + res + ")")
          if (ret.returnValue.code === 100) {
            let photoList = ret.returnValue.resultList
            this.$store.commit(SET_RECORDFILES, photoList)
            photoList.forEach( function(element, index) {
              if (element.fileType === 2007) {
                var image1 = document.getElementById('xctImg')
                image1.src = gerFileUrl(element.fileUrl)
                this.showsctdiv = true
                this.xctSrc = element.fileUrl
                this.$store.commit(SET_XCT, element.fileUrl)
              }else if(element.fileType === 2008) {
                var image2 = document.getElementById('pmtImg')
                image2.src = gerFileUrl(element.fileUrl)
                this.showpmtdiv = true
                this.pmtSrc = element.fileUrl
                this.$store.commit(SET_PMT, element.fileUrl)
              }
              // statements
            });
            this.$vux.loading.hide()
          } else {
            this.$vux.loading.hide()
            this.$vux.toast.show({
              text: ret.returnValue.message,
              type: 'warn'
            })
          }
      }).catch(err => {
        this.$vux.loading.hide()
        alert(err)
      })        
    }, 

    fetchXct () {
      //this.saveInfo()
      Cordova.exec(this.onSuccessXct, this.onError, 'Interactive', 'shotMapInfo', [])      
    },
    fetchPmt () {
      //this.saveInfo()
      Cordova.exec(this.onSuccessPmt, this.onError, 'Interactive', 'shotMapInfo', [])
    },
    xctUpload () {
      if(this.xctSrc !== '' && this.xctSrc.substring(0, 4) !=='http'){
        let that = this
        var canvas = document.getElementById('xctCanvas')
        var imgBase64 = canvas.toDataURL('image/jpeg')
        var blob = this.convertImgDataToBlob(imgBase64)
        var fd = new FormData();
        fd.append('file', blob);//fileData为自定义    

        this.$http({
          url: 'http://20.97.6.109:5006/fileservicebyjmt/breakMultiUpload',
          method: 'POST',
          params: {
            serviceID: this.$store.getters.GetterSysInfo.applyID,
            key: 'xct',
            isThumbnails: false
          },
          // headers: {
          //   contentType: 'application/x-www-form-urlencoded',
          //   requestType:'app',
          //   AccessToken: this.$store.getters.GetterAccessToken,
          //   ApplyID: this.$store.getters.GetterSysInfo.applyID,
          //   SecretKey: this.$store.getters.GetterSysInfo.secretKey
          // },
          body: fd
        }).then(function (res) {
          alert(res)
          let ret = JSON.parse(res)
          if (ret.code === 200) {
            let picList = this.$store.getters.GetterFileList
            let needAdd = true
            picList.forEach(function(item){
              if(item.file_type === 2007){
                needAdd = false
                item.file_url = res.data.fileUrl
              }
            })
            if(needAdd){
              picList.push({
                file_name: res.key,
                file_path: '',
                file_url: res.file_url,
                file_hint : 'xct',
                file_type : '2007'
              })
            }
            alert(JSON.stringify(picList))
            that.$store.commit(SET_RECORDFILES, picList)
            alert("上传成功")
            this.$vux.loading.hide()
          } else {
            this.$vux.loading.hide()
            this.$vux.toast.show({
              text: ret.cmd,
              type: 'warn'
            })
          }
        }).catch(err => {
          this.$vux.loading.hide()
          alert(err)
        })        
      }
    },
    pmtUpload () {
      if(this.pmtSrc !== '' && this.pmtSrc.substring(0, 4) !=='http'){
        let that = this

        var canvas = document.getElementById('pmtCanvas')            
        var imgBase64 = canvas.toDataURL('image/jpeg')        
        var blob = this.convertImgDataToBlob(imgBase64)
        var fd = new FormData()
        fd.append('file', blob);//fileData为自定义

        this.$http({
          url: 'http://20.97.6.109:5006/fileservicebyjmt/breakMultiUpload',
          method: 'POST',
          params: {
            serviceID: this.$store.getters.GetterSysInfo.applyID,
            key: 'pmt',
            isThumbnails: false
          },
          // headers: {
          //   contentType: 'application/x-www-form-urlencoded',
          //   requestType:'app',
          //   AccessToken: this.$store.getters.GetterAccessToken,
          //   ApplyID: this.$store.getters.GetterSysInfo.applyID,
          //   SecretKey: this.$store.getters.GetterSysInfo.secretKey
          // },
          body: fd
        }).then(function (res) {
          alert(res)
          let ret = JSON.parse(res)
            if (ret.code === 200) {
              let picList = this.$store.getters.GetterFileList
              let needAdd = true
              picList.forEach(function(item){
                if(item.file_type === 2008){
                  needAdd = false
                  item.file_url = res.data.fileUrl
                }
              })
              if(needAdd){
                picList.push({
                  file_name: res.key,
                  file_path: '',
                  file_url: res.file_url,
                  file_hint : 'pmt',
                  file_type : '2008'
                })
              }
              alert(JSON.stringify(picList))
              that.$store.commit(SET_RECORDFILES, picList)
              alert("上传成功")
              this.$vux.loading.hide()
            } else {
              this.$vux.loading.hide()
              this.$vux.toast.show({
                text: ret.cmd,
                type: 'warn'
              })
            }
        }).catch(err => {
          this.$vux.loading.hide()
          alert(err)
        })
      }
    },
    onSuccessXct: function (result) {
      var res = JSON.parse(result)
      alert(result)
      var image = document.getElementById('xctImg')
      image.src = res.shot_picture_path
      this.xctSrc = res.shot_picture_path
      this.fsqy = res.address.substring(0,9)
      this.xcwz = res.address.substring(9)
      this.xcmzzb = res.latitude + ':'+ res.longitude
      
      this.showsctdiv = true

      image.onload = function(){
        //var canvas = this.convertImageToCanvas('xctCanvas',image)
        var canvas = document.getElementById('xctCanvas')
        canvas.getContext("2d").drawImage(this, 0, 280, 800, 560, 0, 0, 800, 560)
        
      }
    },
    xctCancel: function () {
      this.xctSrc = ''
      this.showsctdiv = false;
    },
    onSuccessPmt: function (result) {
      var res = JSON.parse(result)
      
      var image = document.getElementById('pmtImg')
      image.src = res.shot_picture_path
      this.pmtSrc = res.shot_picture_path
      this.showpmtdiv = true
      image.onload = function(){
        //var canvas = this.convertImageToCanvas('xctCanvas',image)
        var canvas = document.getElementById('pmtCanvas')
        canvas.getContext("2d").drawImage(this, 0, 280, 800, 560, 0, 0, 800, 560)        
      }
    },
    pmtCancel: function () {
      this.pmtSrc = ''
      this.showpmtdiv = false;
    },
    convertImgDataToBlob: function(base64Data) {
      var format = "image/jpeg";
      var base64 = base64Data;
      var code = window.atob(base64.split(",")[1]);
      var aBuffer = new window.ArrayBuffer(code.length);
      var uBuffer = new window.Uint8Array(aBuffer);
      for(var i = 0; i < code.length; i++){
          uBuffer[i] = code.charCodeAt(i) & 0xff ;
      }

      var blob=null;
      try{
          blob = new Blob([uBuffer], {type : format});
      }
      catch(e){
          window.BlobBuilder = window.BlobBuilder ||
          window.WebKitBlobBuilder ||
          window.MozBlobBuilder ||
          window.MSBlobBuilder;
          if(e.name == 'TypeError' && window.BlobBuilder){
              var bb = new window.BlobBuilder();
              bb.append(uBuffer.buffer);
              blob = bb.getBlob("image/jpeg");

          }
          else if(e.name == "InvalidStateError"){
              blob = new Blob([aBuffer], {type : format});
          }
          else{

          }
      }        
      return blob       
    },
    onError: function (result) {
    },    
    onChangeBhrName (value) {
      this.bhrName = value[0]
    },
    onChangeBhrUnitName (value) {
      this.bhrUnitName = value[0]
    },
    onChangeBhfs (value) {
      this.bhfs = value[0]
    },
    onChangeBdyy (value) {
      this.bdyy = value[0]
    },
    onUnitLoaded () {
    },
    onChange () {
    },
    onShow () {
    },
    onHide (type) {
    }
  },
  data () {
    return {
      showPopup: false,
      showBhrPopup: false,
      showBhrUnitPopup: false,
      showBhfsPopup: false,
      showBdyyPopup: false,
      showsctdiv: false,
      showpmtdiv: false,
      bhrPickerName: [''],
      bhrUnitPickerName: [''],
      bhfsPicker: [''],
      bdyyPicker: [''],
      recordKyNo: this.$store.getters.GetterEntity.recordKyNo,
      recordJjNo: this.$store.getters.GetterEntity.recordJjNo,
      recordAjNo: this.$store.getters.GetterEntity.recordAjNo,
      kyrName: this.$store.getters.GetterEntity.kyrName == '' ? [] : [this.$store.getters.GetterEntity.kyrName],
      kyUnitName: this.$store.getters.GetterEntity.kyUnitName == '' ? [] : [this.$store.getters.GetterEntity.kyUnitName],
      xctSrc: this.$store.getters.GetterEntity.xct_src,      
      pmtSrc: this.$store.getters.GetterEntity.pmt_src,      
      afTime: this.$store.getters.GetterEntity.afTime,
      bjTime: this.$store.getters.GetterEntity.bjTime,
      jjUnitName: this.$store.getters.GetterEntity.jjUnitName == '' ? [] : [this.$store.getters.GetterEntity.jjUnitName],
      kyksTime: this.$store.getters.GetterEntity.kyksTime,
      kyjsTime: this.$store.getters.GetterEntity.kyjsTime,
      recXz: this.$store.getters.GetterEntity.recXz,
      kyDate: this.$store.getters.GetterEntity.kyDate,
      jjrName: this.$store.getters.GetterEntity.jjrName == ''? [] : [this.$store.getters.GetterEntity.jjrName],
      jjrOther: this.$store.getters.GetterEntity.jjrOther,
      fsqy: this.$store.getters.GetterEntity.fsqy,
      tqList: [['晴', '阴', '多云', '雨']],
      fxList: [['无', '东', '南', '西', '北']],
      wdList: [['0 ℃', '1 ℃', '2 ℃', '3 ℃', '4 ℃', '5 ℃', '6 ℃', '7 ℃', '8 ℃', '9 ℃', '10 ℃', '11 ℃', '12 ℃', '13 ℃', '14 ℃', '15 ℃', '16 ℃', '17 ℃', '18 ℃', '19 ℃', '20 ℃', '21 ℃', '22 ℃', '23 ℃', '24 ℃', '25 ℃', '26 ℃', '27 ℃', '28 ℃', '29 ℃', '30 ℃', '31 ℃', '32 ℃', '33 ℃', '34 ℃', '35 ℃', '36 ℃', '37 ℃', '38 ℃', '39 ℃', '40 ℃']],
      sdList: [['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%']],
      lightList: [],
      addressData: ChinaAddressData,
      xctq: this.$store.getters.GetterEntity.xctq === '' ? [] : [this.$store.getters.GetterEntity.xctq],
      xcfx: this.$store.getters.GetterEntity.xcfx === '' ? [] : [this.$store.getters.GetterEntity.xcfx],
      
      xcwz: this.$store.getters.GetterEntity.xcwz,
      xcwzzb: this.$store.getters.GetterEntity.xczb,
      xcwd: this.$store.getters.GetterEntity.xcwd === '' ? [] : [this.$store.getters.GetterEntity.xcwd],
      xcsd: this.$store.getters.GetterEntity.xcsd === '' ? [] : [this.$store.getters.GetterEntity.xcsd],
      bhFlag: false,
      fsList: [['专人看护现场，防止他人进入', '设立警戒带，划定禁行区域', '封锁出入口', '其他']],
      zkList: [['原始现场', '变动现场']],
      bdList: [['事主进入', '报案人进入', '公共区域', '补勘现场', '其他']],      
      bhrName: this.$store.getters.GetterEntity.bhrName,
      bhrUnitName: this.$store.getters.GetterEntity.bhrUnitName,
      bhfs: this.$store.getters.GetterEntity.bhfs === '' ? [] : [this.$store.getters.GetterEntity.bhfs],
      bdyy: this.$store.getters.GetterEntity.bdyy === '' ? [] : [this.$store.getters.GetterEntity.bdyy],    
      xczk: this.$store.getters.GetterEntity.xczk === '' ? [] : [this.$store.getters.GetterEntity.xczk],
      bhrZw: this.$store.getters.GetterEntity.bhrZw
    }
  }
}
</script>

<style>
  .contentinput{
    text-align: right
  }
  .demo4-item {
    background-color: #ddd;
    color: #222;
    font-size: 14px;
    padding: 5px 10px;
    margin-right: 10px;
    line-height: 18px;
    border-radius: 15px;
  }
  .demo4-item-selected {
    background-color: #FF3B3B;
    color: #fff;
  }
  .demo4-item-disabled {
    color: #999;
  }
</style>
