<template>
  <div>
    <div v-if="~this.isAdd" v-for='oriFile in oriFiles'>
      <x-img v-bind:src="onGetFile(oriFile.file_url)" class="preview" :offset="1000"></x-img>
      <cell v-bind:title="onRenderFileType(oriFile.file_type)" v-bind:value="oriFile.file_hint"></cell>
    </div>
    <img class="preview" src="" id="test"/>
    <x-hr></x-hr>
    <x-button type="primary" @click.native="showSelection = true" >增加照片</x-button>
    <div v-for='(file, index) in uploaderFiles'>
      <group>
        <img class="preview" :src="file.file_path"/>
        <x-img v-bind:src="file.file_path" class="preview"></x-img>
        <x-button type="warn" mini @click.native="onCancelFile(index,$event)" >取消该图片</x-button>
        <x-input title="图片说明:" :debounce="500" placeholder="请填写说明" @on-change="onChangePicHint($event,index)" text-align='right' v-bind:value="file.file_hint" class="input-hint"></x-input>
        <br>
        <checker
          default-item-class="demo5-item" @on-change="onChangePicType($event,index)"
          selected-item-class="demo5-item-selected" v-bind:value="file.file_type" >
            <checker-item value="2001">现场方位</checker-item>
            <checker-item value="2002" >现场概貌</checker-item>
            <checker-item value="2003" >重点部位</checker-item>
        </checker>
      </group>
    </div>
    <actionsheet v-model="showSelection" :menus="menusForChooseFile" @on-click-menu="getFile" show-cancel></actionsheet>
    
  </div>
</template>

<script>
import { Group, XInput, XSwitch, PopupPicker, XHr, XButton, Flexbox, FlexboxItem, XProgress, Cell, XImg, Checker, CheckerItem, Actionsheet } from 'vux'

export default {
  components: {
    Group,
    XInput,
    PopupPicker,    
    XHr,
    XButton,
    Flexbox,
    FlexboxItem,
    XProgress,
    XImg,
    Cell,
    Checker,
    CheckerItem,
    XSwitch,
    Actionsheet
  },
  computed: {    
  },
  mounted: function () {    
    this.uploaderFiles = this.$store.getters.GetterFileList
    var saveDirectory = "PBSFiles"
    this.getSavePath(saveDirectory)
  },
  methods: {
//     getFile()
//     {
//         navigator.camera.getPicture(function(imageURI) {
//                     window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
//                         fileEntry.file(function(fileObj) {
//                             uploadTest(fileObj);
//                         });
//                     });
//                 },
//                 function(message) {
// //                    alert('get picture failed');
//                 },
//                 {
//                     quality: 50,
//                     targetWidth: 400,
//                     targetHeight: 500,
//                     destinationType: navigator.camera.DestinationType.FILE_URI,
//                     sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
//                 }
//         );
//     },
    getSavePath (saveDirectory) {
        app.getAppDirectoryEntry(function(res){
        //区分平台，并将相应的目录保存到全局,方便下面下载的时候使用
    //            alert(JSON.stringify(res));     //wangxi
            if(window.devicePlatform=="android"){
                this.savePath = res.sdcard + "/" + saveDirectory;
            }
        });
    },
    getFile (type) {
      console.log(type)
      if(type === 'fromPhotos'){
        app.chooseFile(addFileNew,
          function(err){
            alert(JSON.stringify(err))
            console.log("error_" , err)
          })

        // var params = {"action" : "choice_file_activity"}
        // //var params2 = {"action" : "xinghuo_back_camera_activity"}

        // app.szgaplugin.startActivityForResult(params, this.addFile, function (err) {
        //     //alert(JSON.stringify(err));
        // })
        // navigator.camera.getPicture(addFile, getFileError, {
        //     quality: 100,
        //     //targetWidth: 600,
        //     //targetHeight: 1000,
        //     destinationType: navigator.camera.DestinationType.FILE_URI,
        //     sourceType: 0,
        //     encodingType: navigator.camera.EncodingType.JPEG
        // })
      }else if(type === 'takePhotos') {
        navigator.camera.getPicture(addFile, getFileError, {
            quality: 100,
            //targetWidth: 600,
            //targetHeight: 1000,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            encodingType: navigator.camera.EncodingType.JPEG
        })    
      }
    },    
    addFile (res) {
      //var ret = eval("(" + res + ")")
      //getPlateInfo(ret)
      var arr = res.split('/')
      var file = {
        file_name : arr[arr.length-1],
        file_path : res,
        file_url: '',
        file_hint : '',
        file_type : '2001'
      }
      //测试图像显示
      // var image = document.getElementById('test')
      // image.src = res
      // alert(ret.file_path)

      this.uploaderFiles.push(file)

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
          if(item.file_type === 2007){
            needAdd = false
            item.file_url = res.file_url
          }
        })
        if(needAdd){
          picList.push({
            file_name: res.key,
            file_url: ''
          })
        }
      },function(err){
          alert("error_" + err);
      })
      // var options = new FileUploadOptions();
      // options.fileKey = file.file_name;     //用于设置参数，服务端的Request字串
      // options.fileName = file.file_name;    //希望文件存储到服务器所用的文件名
      // options.mimeType = "image/jpeg";  //图片格式

      // var uri = encodeURI(_url + '/api/Files/MutilUpload')
      // this.$vux.loading.show({
      //   text: '文件上传中'
      // })
      // xh.uploadFile(fileEntry.fullPath,uri,uploadOK,onFail,options)        
        
    },
    addFileNew (res) {
      //var ret = eval("(" + res + ")")
      //getPlateInfo(ret)
      let that = this
      var file = {
        file_id : 0,
        file_name : '',
        file_path : res.file_path,
        file_url: '',
        file_hint : '',
        file_type : '2001'
      }
      //测试图像显示
      // var image = document.getElementById('test')
      // image.src = res
      // alert(ret.file_path)      

      var sendObj = {
        localFileName: res.file_path,   //本地文件路径
        fileType:1,        //文件类型，1是图片，2是视频，3是其他
        isCompress:false      //是否压缩文件   
      }
      app.uploadFile(sendObj,function(res){
        console.log("success_" , res)
        file.file_url = res.file_url

        that.uploaderFiles.push(file)
        that.$vux.loading.hide()
      },function(err){
          alert("error_" + err)
          this.$vux.loading.hide()
      })      
      this.$vux.loading.show({
        text: '文件上传中'
      })
        
    },
    getFileError (err) {
        //alert(JSON.stringify(err));
    },
    uploadOK (msg) {
        alert(JSON.stringify(msg))
        app.hint("上传图片成功!")
        var data = eval("(" + msg.response + ")")

        // var Pfname = data.obj[0].pfname
        // imgName = Pfname.substr(Pfname.lastIndexOf('/') + 1)
        // this.uploaderFiles[this.uploaderFiles.length-1].file_url = imgName

        //mediaFiles.substr(mediaFiles.lastIndexOf('/') + 1)
        this.$vux.loading.hide()
    },
    onFail(err) {
        app.hint("上传图片失败!");
        alert(JSON.stringify(err));
        this.$vux.loading.hide()
    },    
    onGetFile (oriFileUrl) {
      var subStr = new RegExp('(\d+)\.(\d+)\.(\d+)\.(\d+)(:(\d+)|)')
      var result = oriFileUrl.replace(subStr, '172.29.3.76:9219')
    },
    onRenderFileType (type) {
      switch (type) {
        case 2001:
          return '现场方位'
        case 2002:
          return '现场概貌'
        case 2003:
          return '重点部位'
        case 2004:
          return '现场制图'
        case 2005:
          return '其他'
        case 2006:
          return '见证人签名'
        case 2007:
          return '现场方位图'
        case 2008:
          return '现场平面图'
        default:
          return '其他'
      }
    },
    onChangePicHint (val, index) {
      this.uploaderFiles[index].file_hint = val        
    },
    onChangePicType (val, index) {
      this.uploaderFiles[index].file_type = val
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
    }
  },
  data () {
    return {
      isAdd: true,
      uploaderFiles: [],      
      oriFiles: [],     
      showSelection: false,
      menusForChooseFile: {
        fromPhotos: '从相册选择',
        takePhotos: '拍照'
      },
      savePath: '',
      typeList: [[{
        value: '2001',
        name: '现场方位'
      },
      {
        value: '2002',
        name: '现场概貌'
      },
      {
        value: '2003',
        name: '重点部位'
      },
      {
        value: '2004',
        name: '现场制图'
      },
      {
        value: '2005',
        name: '其他'
      }]]      
    }
  }
}
</script>

<style>
  .uploadbutton{
  }
  .preview {
    width: 300px;
    height: 300px
  }
  .demo5-item {
    width: 100px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 6px;
  }
  .demo5-item-selected {
    background: #ffffff url(../../assets/active.png) no-repeat right bottom;
    border-color: #ff4a00;
  }
  .input-hint {
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
  }
</style>
