<template>
  <div>
    <group>
      <x-input title="见证人" v-model='jzrName' text-align='right'></x-input>
      <cell title="见证人签名"  is-link @click.native="fetchSingature" ></cell>
      <img v-show="showQm" src=""  id="qmImg" width="300" height="420" >
      <group title="见证人性别">
        <radio :options="sexList" v-model='jzrSex'></radio>
      </group>
      <datetime v-model="jzrBirth" title="见证人出生日期" min-year=1900 confirm-text="完成" cancel-text="取消" format="YYYY-MM-DD" ></datetime>
      <x-input title="见证人地址" v-model='jzrAddress' text-align='right'></x-input>
      <x-input title="指挥人" v-model='zhrName' text-align='right'>
        <x-button slot="right" type="primary" mini @click.native="showZhrPopup = true">></x-button>
      </x-input>      
      <x-input title="指挥人单位" v-model='zhrUnitName' text-align='right'>
        <x-button slot="right" type="primary" mini @click.native="showZhrUnitPopup = true">></x-button>
      </x-input>
      <x-input title="指挥人职位" v-model='zhrZw' text-align='right'></x-input>
      <x-input title="笔录人" v-model='blrName' text-align='right'>
        <x-button slot="right" type="primary" mini @click.native="showBlrPopup = true">></x-button>
      </x-input>
      <x-input title="制图人" v-model='ztrName' text-align='right'>
        <x-button slot="right" type="primary" mini @click.native="showZtrPopup = true">></x-button>
      </x-input>
      <x-input title="照相人" v-model='zxrName' text-align='right'>
        <x-button slot="right" type="primary" mini @click.native="showZxrPopup = true">></x-button>
      </x-input>
      <x-input title="录像人" v-model='lxrName' text-align='right'>
        <x-button slot="right" type="primary" mini @click.native="showLxrPopup = true">></x-button>
      </x-input>
      <x-input title="录音人" v-model='lyrName' text-align='right'>
        <x-button slot="right" type="primary" mini @click.native="showLyrPopup = true">></x-button>
      </x-input>
    </group>
    <popup v-model="showZhrPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='userList' v-model='zhrPickerName' @on-change='onChangeZhrName'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showZhrPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
    <popup v-model="showZhrUnitPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='unitList' v-model='zhrUnitPickerName' @on-change='onChangeZhrUnitName'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showZhrUnitPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
    <popup v-model="showBlrPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='userList' v-model='blrPickerName' @on-change='onChangeBlrName'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showBlrPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
    <popup v-model="showZtrPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='userList' v-model='ztrPickerName' @on-change='onChangeZtrName'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showZtrPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
    <popup v-model="showZxrPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='userList' v-model='zxrPickerName' @on-change='onChangeZxrName'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showZxrPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
    <popup v-model="showLxrPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='userList' v-model='lxrPickerName' @on-change='onChangeLxrName'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showLxrPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
    <popup v-model="showLyrPopup" class="checker-popup">
      <div style="padding:10px 10px 10px 10px;">
        <picker :data='userList' v-model='lyrPickerName' @on-change='onChangeLyrName'></picker>
      </div>
      <div style="padding: 15px;">
        <x-button @click.native="showLyrPopup = false" plain type="primary"> 确  定 </x-button>
      </div>
    </popup>
  </div>
</template>

<script>
import { Group, XInput, PopupPicker, Picker, XButton, Popup, Cell, Datetime, Radio } from 'vux'
import { SET_RECORDPERSON } from '../../mutationTypes'
export default {
  components: {
    Group,
    PopupPicker,
    XInput,
    Picker,
    XButton,
    Popup,
    Cell,
    Datetime,
    Radio
  },
  mounted: function () {
    this.isAdd = this.$route.query.isAdd
    if(this.$store.getters.GetterEntity.qmBase64Data !== '') {
      var image = document.getElementById('qmImg')
      image.src = this.$store.getters.GetterEntity.qmBase64Data
      this.showQm = true
    }
  },
  computed: {
    unitList: function () {
      return this.$store.getters.GetterUnitState
    },
    userList: function () {
      return this.$store.getters.GetterUserState
    }
  },
  methods: {
    onChangeZhrName (value) {
      this.zhrName = value
    },
    onChangeZhrUnitName (value) {
      this.zhrUnitName = value
    },
    onChangeBlrName (value) {
      this.blrName = value[0]
    },
    onChangeZtrName (value) {
      this.ztrName = value[0]
    },
    onChangeZxrName (value) {
      this.zxrName = value[0]
    },
    onChangeLxrName (value) {
      this.lxrName = value[0]
    },
    onChangeLyrName (value) {
      this.lyrName = value[0]
    },
    fetchSingature () {
      let entity4 = {
        jzrName: this.jzrName,
        jzrSex: this.jzrSex,
        jzrBirth: this.jzrBirth,
        jzrAddress: this.jzrAddress,
        zhrName: this.zhrName,
        zhrUnitName: this.zhrUnitName,
        zhrZw: this.zhrZw,
        blrName: this.blrName,
        ztrName: this.ztrName,
        zxrName: this.zxrName,
        lxrName: this.lxrName,
        lyrName: this.lyrName
      }
      this.$store.commit(SET_RECORDPERSON, entity4)
      this.getSignature()
    },
    getSignature(){
        var params = { "action":"hand_write_activity",
            "names" : ["is_screen_portrait"],
            "values" : [ "1"]
        };
        app.szgaplugin.startActivityForResult(params, this.getSignatureSuccess, function (err) {
            alert(JSON.stringify(err));
        })
    },
    getSignatureSuccess (res) {
      //alert(JSON.stringify(res))
      try{
        var ret = eval("(" + res + ")");
        var image = document.getElementById('qmImg');
        image.src = ret.file_path;
        //alert('image.src'+image.src)
        this.qmtSrc = ret.file_path;
        this.qmtUpload(ret.file_path)
      }catch(e){
        alert(e)
      }
    },
    qmtUpload (filePath) {
      let that = this
      var sendObj = {
          localFileName: this.xctSrc,   //本地文件路径
          fileType:1,        //文件类型，1是图片，2是视频，3是其他
          isCompress:false      //是否压缩文件   
      }
      app.uploadFile(sendObj,function(res){
        console.log("success_" , res)
        let picList = this.$store.getters.GetterFileList
        let needAdd = true
        picList.forEach(function(item){
          if(item.file_type === 2006){
            needAdd = false
            item.file_url = res.file_url
          }
        })
        if(needAdd){
          picList.push({
            file_id: 0,
            file_name: res.key,
            file_path : '',
            file_url: res.file_url,
            file_hint : 'qmt',
            file_type : '2006'
          })
        }
        that.$store.commit(SET_RECORDFILES, picList)
        that.showQm = true
        app.hint("上传成功!")
      },function(err){
        app.hint("上传图片失败!");
        alert("error_" + err)
      })
    },
    uploadOK (msg) {
      //alert(JSON.stringify(msg))
      this.showQm = true
      app.hint("上传成功!")
    },
    onFail (err) {
      app.hint("上传图片失败!");
      alert(JSON.stringify(err));
    }
  },
  data () {
    return {
      showZhrPopup: false,
      showZhrUnitPopup: false,
      showBlrPopup: false,
      showZtrPopup: false,
      showZxrPopup: false,
      showLxrPopup: false,
      showLyrPopup: false,
      showQm: false,
      zhrPickerName: [''],
      zhrUnitPickerName: [''],
      blrPickerName: [''],
      ztrPickerName: [''],
      zxrPickerName: [''],
      lxrPickerName: [''],
      lyrPickerName: [''],
      sexList: ['男','女'],
      zhrName: this.$store.getters.GetterEntity.zhrName,      
      zhrUnitName: this.$store.getters.GetterEntity.zhrUnitName,
      blrName: this.$store.getters.GetterEntity.blrName,
      ztrName: this.$store.getters.GetterEntity.ztrName,
      zxrName: this.$store.getters.GetterEntity.zxrName,
      lxrName: this.$store.getters.GetterEntity.lxrName,
      lyrName: this.$store.getters.GetterEntity.lyrName,
      jzrName: this.$store.getters.GetterEntity.jzrName,
      jzrSex: this.$store.getters.GetterEntity.jzrSex,
      jzrBirth: this.$store.getters.GetterEntity.jzrBirth,
      jzrAddress: this.$store.getters.GetterEntity.jzrAddress,
      zhrZw: this.$store.getters.GetterEntity.zhrZw,
      isAdd: '1'
    }
  }
}
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px
}
</style>
