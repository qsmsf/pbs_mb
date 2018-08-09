<template>
  <div>
    <x-header :left-options="{showBack: true, backText: '返回'}">查看最近7天的记录</x-header>
    <br>
    <scroller lock-x scrollbar-y use-pulldown  @on-pulldown-loading="loadList" ref="recordScroller" v-model="status" height="-46">
      <!--content slot-->
      <div class="box2">
        <group v-for="rec in recList">
          <Cell v-bind:title='trimDate(rec.jjTime)'  v-bind:inline-desc='rec.recordNo+ "--" +rec.recTitle' @click.native="onChooseRec(rec)" is-link></Cell>
        </group>
      </div>

      <!--pulldown slot-->
      <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
        <span v-show="status.pulldownStatus === 'default'"></span>
        <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' || status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">↓</span>
        <span v-show="status.pulldownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>
  </div>
</template>

<script>
import { Group, Spinner, XButton, Scroller, Cell, XHeader } from 'vux'
import { SET_RECORDBASE, SET_RECORDDISP, SET_RECORDPERSON, SET_RECORDOTHER, SET_RECORDFILES, SET_LOC } from '../mutationTypes'

export default {
  components: {
    Group,
    Spinner,
    Scroller,
    Cell,
    XHeader,
    XButton
  },
  mounted: function () {
    
    this.loadList()
    // this.kyksTime = '2017-11-13'
  },
  methods: {
    loadList () {      
      let filters = {
          kyUnitName: this.$store.getters.GetterMe.deptName,
          kyrName: this.$store.getters.GetterMe.userName,
          kyDateBegin: '',
          kyDateEnd: '',
          recState: '',
          recordTitle: '',
          recordNo: '',
          offset: 0,
          limit: 20
        }
      let data = JSON.stringify(this.filters)
      this.$http({
        url: this.$store.getters.GetterBaseUrl + 'Records/getRecentRecordList',
        method: 'GET',
        emulateJSON: true,        
        body: {
          filter: data
        },
        headers: {
          contentType: 'application/x-www-form-urlencoded',
          requestType:'app',
          accessToken: this.$store.getters.GetterAccessToken,
          applyID: this.$store.getters.GetterSysInfo.applyID,
          secretKey: this.$store.getters.GetterSysInfo.secretKey
        }
      }).then(function (res) {
        if (res.data.code === 604) {
          let returnValue = eval("(" + res.returnValue + ")");
          alert(returnValue)
          this.recList = returnValue.data.resultList
          this.$refs.recordScroller.donePulldown()
        } else {
          this.$vux.toast.show({
            text: res.data.data,
            type: 'warn'
          })
          this.$refs.recordScroller.donePulldown()
        }
      }).catch(err => {
        alert(err)        
        this.$refs.recordScroller.donePulldown()
      })          
    },
    showName (i) {
      return i + ''
    },
    trimDate (strDate) {
      return strDate.substring(0, 16).replace('T', ' ')
    },
    onChooseRec (rec) {
      let entity1 = {
        recordKyNo: rec.recordKyNo,
        recordJjNo: rec.recordJjNo,
        recordAjNo: rec.recordAjNo,
        kyUnitName: rec.kyUnitName,
        kyUnitId: rec.kyUnitId,
        jjrName: rec.jjrName,
        jjrOther: rec.jjrOther,
        jjUnitName: rec.jjUnitName,
        kyDate: rec.kyDate === null ? '' : rec.kyDate.substring(0, 10),
        afTime: rec.afTime === null ? '' : rec.afTime.substring(0, 16).replace('T', ' '),
        jjTime: rec.jjTime === null ? '' : rec.jjTime.substring(0, 16).replace('T', ' '),
        kyksTime: rec.kyksTime === null ? '' : rec.kyksTime.substring(0, 16).replace('T', ' '),
        kyjsTime: rec.kyjsTime === null ? '' : rec.kyjsTime.substring(0, 16).replace('T', ' '),
        recXz: rec.recXz,
        recTitle: rec.recTitle,
        xctSrc: '',
        pmtSrc: '',
        fsqy: rec.fsqy,
        xcwz: rec.xcwz,
        xczb: rec.xczb,
        xctq: rec.xctq,
        xcfx: rec.xcfx,
        xcwd: rec.xcwd,
        xcsd: rec.xcsd,
        xcgz: rec.xcgz,
        bhFlag: rec.bhFlag,
        bhrName: rec.bhrName,
        bhrUnitName: rec.bhrUnitName,
        bhrZw: rec.bhrZw,
        bhfs: rec.bhfs,
        xczk: rec.xczk,
        bdyy: rec.bdyy
      }
      this.$store.commit(SET_RECORDBASE, entity1)

      let entity2 = {
        kysy: rec.kysy,
        xcms: rec.xcms
      }
      this.$store.commit(SET_RECORDDISP, entity2)

      let entity4 = {
        jzrName: rec.jzrName,
        jzrSex: rec.jzrSex,
        jzrBirth: rec.jzrBirth,
        jzrAddress: rec.jzrAddress,      
        zhrName: rec.zhrName,
        zhrUnitName: rec.zhrUnitName,
        zhrZw: rec.zhrZw,
        blrName: rec.blrName,
        ztrName: rec.ztrName,
        zxrName: rec.zxrName,
        lxrName: rec.lxrName,
        lyrName: rec.lyrName
      }
      this.$store.commit(SET_RECORDPERSON, entity4)

      let entity5 = {
        bgrId: rec.bgrId,
        bgrName: rec.bgrName,
        uuid: rec.uuid,
        recordNo: rec.recordNo,
        recordId: rec.recordId,
        recState: rec.recState
      }
      this.$store.commit(SET_RECORDOTHER, entity5)
      let loc = {
        xcEast: rec.xcEast,
        xcWest: rec.xcWest,
        xcNorth: rec.xcNorth,
        xcSouth: rec.xcSouth
      }
      this.$store.commit(SET_LOC, loc)
      this.$store.commit(SET_XCT, '')
      this.$store.commit(SET_PMT, '')
      this.$store.commit(SET_QMT, '')
      this.$store.commit(SET_RECORDFILES, [])

      this.$router.push({name: 'Step1', query: {isAdd: '0', curStep: 1}})
    }
  },
  data () {
    return {
      recList: [],
      status: {
        pulldownStatus: 'default'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .box2-wrap {
    height: auto;
    overflow: hidden;
  }
  .rotate {
    transform: rotate(-180deg);
  }
  .pulldown-arrow {
    display: inline-block;
    transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
  }
</style>
