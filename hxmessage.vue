<template>
  <div class="message-container">
    <nav v-if="!isModalIm" class="diao-header"
         style="width: 100%;height: 24px;font-size: 14px;color: #1F13EC;line-height: 24px">
      提示：您与客户的聊天内容将在系统退出后自动保存至浏览器下载路径下（例如：C:\Users\****\Downloads）
    </nav>
    <section
      :class="['main-container', 'el-dialogs',]">
      <section class="contack-content-left" :style="{display:isModalIm?'none':'block'}">
        <ul>
          <li v-for="(item,index) in connectList" :key="index" class="item-tar" @click="selectChatObj(item)"
              :style="{backgroundColor: item.isSelect  ? 'rgba(228,228,228,0.6)': 'white',cursor:'pointer'}">
            <div class="item-check" style="display: flex;flex-direction: row;align-items: center;position: relative">
              <img
                :src="item.isMySelf? (item.toHead?item.toHead:headerImgPlaceholder):(item.fromHead?item.fromHead:headerImgPlaceholder)"
                alt=""
                style="width: 40px;height: 40px;border-radius: 20px;">
              <div style="display: inline;line-height: 1.1em;margin-left: 5px;width: 100%">
                <section style="width: 100%;position: relative;min-width: 100px">
                  <span>{{item.isMySelf? (item.toName?item.toName.substring(0,11) :item.to):(item.fromName?item.fromName.substring(0,11):item.from)}}</span>
                  <span style="position: absolute;right: 0;font-size: 10px">{{item.time}}</span>
                </section>
                <h5 style="margin-top: 8px">{{((item.msgType==='img') ||(item.data.includes(includeString)))?'图片':
                  item.data.substring(0,20)}}</h5>
                <span
                  v-if="(item.unRead>0)"
                  style="width: 6px;height: 6px;
                  background-color: red;
                  position: absolute;
                  right: 8px;
                  bottom: 14px;
                  border-radius: 3px;
                  overflow: hidden"></span>
              </div>
              <div style="width: 100%;height: 1px;background-color: #F4F4F4;position: absolute;bottom: 0px;left: -8px"/>
            </div>
          </li>
        </ul>
      </section>
      <!-- modules-1 -->
      <section class="contack-right-content right">
        <!-- 顶部tools工具栏 -->
        <header class="contack-user-name-tools-bar top">
          <h1>正在和{{item?(item.purchaserPhone?item.purchaserPhone:toImId):currentChatName}}聊天</h1>
        </header>
        <!-- 内容区 -->
        <section class="contack-content">
          <!-- 消息内容 -->
          <section class="contack-message-container">
            <!-- 聊天记录模块 -->
            <section class="contack-message-content">
              <!-- 聊天内容盒子 -->
              <section class="contack-message-content-list-box" ref="messageBox">
                <ul class="current-user-message-list-box">
                  <li
                    v-for="(message, index) in  messageList "
                    :key="index">
                    <div style="margin-top: 20px">
                      <h5 style="text-align: center">{{message.time}}</h5>
                      <div :class="['current-user-message-item', message.isMySelf? 'message-right' : 'message-left']"
                           :key="index">
                        <section class="user-author-img">
                          <img class="author-img"
                               :src="  message.isMySelf? (message.fromHead?message.fromHead:headerImgPlaceholder): (message.toHead?message.toHead:headerImgPlaceholder)">
                        </section>
                        <section class="message-card-item-house-info" :style="{ maxWidth:isModalIm?'20%':'30%',}">
                          <section class="message-content-style">
                            <article class="message-html-content" v-html="message.data"
                                     @click="clickContent(message)"></article>
                          </section>
                        </section>
                      </div>
                    </div>
                  </li>
                </ul>
              </section>
            </section>
            <!-- 底部输入模块 -->
            <section class="contack-message-insert" style="position: relative">
              <!-- 工具栏 -->
              <header class="contack-message-insert-tools-bar">
                <!-- 左侧工具栏 -->
                <section class="tools-bar-box" style="min-width: 200px">
                  <el-tooltip placement="top-start" effect="light" popper-class="Emoji">
                    <template slot="content">
                      <section class="emojiType">
                        <el-tabs type="border-card" tab-position="bottom" class="tab-customer-emoji">
                          <el-tab-pane class="tab-emoji">
                            <span slot="label" class="label-sty">
                              <img src="/static/img/faces/ee_1.png" alt="imgEmoji">
                            </span>
                            <ul class="emoji-box">
                              <li class="emoji-item" v-for="item in EmojiList" :key="item.id"
                                  v-show="item.type === 'img'" @click="addEmoji(item)">
                                <img :src="item.img" :data-emoji-id="item.emoji">
                              </li>
                            </ul>
                          </el-tab-pane>
                          <!--<el-tab-pane class="tab-emoji">-->
                            <!--<span slot="label" class="label-sty">-->
                              <!--😃-->
                            <!--</span>-->
                            <!--<ul class="emoji-box">-->
                              <!--<li class="emoji-item" v-for="item in EmojiList" :key="item.id"-->
                                  <!--v-show="item.type === 'emoji'" @click="addEmoji(item)">-->
                                <!--<span>{{ item.img}}</span>-->
                              <!--</li>-->
                            <!--</ul>-->
                          <!--</el-tab-pane>-->
                        </el-tabs>
                      </section>
                    </template>
                    <span class="tools-item">
                       <img src="/static/img/faces/weixinbiaoqing.png" alt>
                    </span>
                  </el-tooltip>
                  <span class="tools-item" style="margin-left: 20px;">
                    <label for="imgFileImg">
                       <img src="/static/img/faces/accessories.png" alt>
                    </label>
                    <input id="imgFileImg" type="file" ref="selectFileImg" accept="image/*"
                           @change="autoSendFileChange($event, 'img')">
                  </span>
                </section>
              </header>
              <!-- 输入框 @keydown.enter="sendMessage" -->
              <cite
                ref="execInput"
                :disabled="true"
                v-popover:houseInfo
                placeholder="place input content"
                @drop="dragInputChange"
                @paste="paste"
                @input="input"
                @keydown="shiftAndEnterSend"
                contenteditable>
              </cite>
              <!-- 底部按钮组 发送消息等 -->
              <section class="contack-message-buttom-btn">
                <section v-if="isModalIm" class="contack-message-buttom-btn-close" @click="closeMessage">关闭</section>
                <section class="contack-message-buttom-btn-send" @click="sendMessage">发送</section>
              </section>
              <div style="width: 5px;height: 100%;background-color: #f1f3fa;position: absolute;left: 0;top: 0;"/>
            </section>
          </section>
        </section>
      </section>
    </section>
    <el-dialog :visible.sync="dialogVisible" custom-class="custom-class">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>

  import {
    saveIMMsg,
    getIMList,
    saveImListToLocal,
    getAllIMList,
    iMUserIsLogin,
    logoutIM,
    loginIM,
    updateIMList,
  } from '../../assets/js/webImTool'
  import {getCurrentTime} from '../../assets/js/Utils'
  import connect from '../../assets/js/eventBus'
  import {isLegalUrl} from '../../assets/js/RegularUtils'

  export default {
    props: ['isModalIm', 'item'],
    data() {
      return {
        connectList: [], //当前和哪些人聊天
        messageList: [],  //右边的消息集合
        msgBold: null,//   // 当前输入框的消息
        headerImgPlaceholder: '/static/img/faces/avatar.jpg',
        EmojiList: [],  // emoji集合
        pasteImgList: [],// 粘贴板图片处理
        localImgUrlObjct: {}, // 发送图文本地存储时单独对图片进行处理
        toImId: '', //当前聊天对象
        currentUserHeader: '',//当前的登录用户的头像
        currentUserName: '',//当前的登录用户的昵称
        currentChatName: '',//当前和谁聊天
        includeString: '<img',
        dialogVisible: false,
        dialogImageUrl: ''//查看大图
      }
    },
    watch: {
      isModalIm: function (newValue, oldValue) {
        if (newValue) {
          if (!window.isLoginIM) { //防止掉线
            loginIM();
          }
          this.loadData();
        }
      },
    },

    methods: {
      clickContent(item) {
        let that = this;
        item.data.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, params) {
          if (isLegalUrl(params)) {
            // that.dialogVisible = true;
            // that.dialogImageUrl = params;

            let img = '<img style="width: 100%;max-height: 800px;" src="' + params + '" alt="">';
            that.$alert(img, {
              dangerouslyUseHTMLString: true
            });
          }
        })
      },

      selectChatObj(item) {
        try {
          if (!item.isSelect) {
            this.toImId = item.isMySelf ? item.to : item.from;
            this.currentChatName = item.isMySelf ? item.toName : item.fromName;
            let imList = getAllIMList();
            for (let item0 of imList) {
              if (item.contactMan === item0.contactMan) {
                this.messageList = item0.messageList;
                break;
              }
            }
            if (item.unRead > 0) {
              item.unRead = 0;
              updateIMList(item);
            }
            for (let item1 of this.connectList) {
              if (item.contactMan === item1.contactMan) {
                item1.isSelect = true;
                item1.unRead = 0;
              } else {
                item1.isSelect = false;
              }
            }
            // console.log('--------scrollBottom-------');
            // this.timer = setTimeout(() => {
            //   this.scrollBottom();
            //   clearTimeout(this.timer);
            // }, 1000);


          }
        } catch (e) {
          console.log(e);
        }
      },

      input() {
        const v = this.$refs['execInput'].innerHTML;
        // console.log(JSON.stringify(v.length));
        if (v && v.length < 1000) {
          this.msgBold = v
        }
      },
      // 粘贴消息到输入框
      paste(e) {
        e.preventDefault()
        if (e.clipboardData && e.clipboardData.types) {
          if (e.clipboardData.items.length > 0) {
            if (/^image\/\w+$/.test(e.clipboardData.items[0].type)) {
              const blob = e.clipboardData.items[0].getAsFile()
              const url = window.URL.createObjectURL(blob)
              let insertImg = {}
              insertImg[url] = blob
              this.pasteImgList.push(insertImg)
              document.execCommand('insertImage', false, url)
            }
          }
        }
        // e.preventDefault()
        const html = e.clipboardData.getData('text/html')
        document.execCommand('insertHTML', false, html)
        this.input()
      },
      // 拖拽图片操作
      dragInputChange(e) {
        e.preventDefault();
        console.log(e.dataTransfer)
      },
      // 清除消息输入框
      clearMsg() {
        this.$refs['execInput'].innerHTML = null
      },

      // 初始化Emoji表情
      initEmoji(_WebIM) {
        const baseUrl = _WebIM.Emoji.path
        Object.keys(_WebIM.Emoji.map).map((item, index) => {
          this.EmojiList.push({
            id: '1-' + index,
            type: 'img',
            img: baseUrl + _WebIM.Emoji.map[item],
            name: _WebIM.Emoji.map[item],
            emoji: item
          })
        });
        // _WebIM.NewEmoji.map.map((item, index) => {
        //   this.EmojiList.push({
        //     id: '2-' + index,
        //     type: 'emoji',
        //     img: item,
        //     name: item,
        //     emoji: item
        //   })
        // })
      },
      // 格式化本地图片表情转换
      formatLocalImgEmojiToEmoji(_string) {
        const _this = this
        return _string.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, params) {
          let handlerString = params
          params.replace(/[^/]+(?=$)/g, function (_params) {
            _this.EmojiList.map(item => {
              if (item.name === _params) {
                handlerString = item.emoji
              }
            })
          });
          if (handlerString === params) {
            handlerString = `img:[${handlerString}]`
          }
          return handlerString
        })
      },
      // 关闭弹窗
      closeMessage(e) {
        // saveImListToLocal();
        this.$emit('closeImModal');
      },

      // 按住shift+enter发送消息
      shiftAndEnterSend(event) {
        if (event.keyCode === 13 && !event.shiftKey) {
          this.sendMessage();
          event.preventDefault();
          event.stopPropagation();
        }
      },
      // 发送文本消息
      sendMessage() {
        this.$message.closeAll();
        if (!this.msgBold || !(this.msgBold.replace(/&nbsp;|\s/g, ''))) {
          this.$message.info('发送内容不能为空!');
          return
        }
        const _this = this;
        const messageContext = this.msgBold;
        const filterMsg = _this.sendPasteImg(_this.formatHTML(_this.formatLocalImgEmojiToEmoji(messageContext)));
        if (!filterMsg) {
          this.msgBold = null;
          this.clearMsg();
          return
        }
        let id = this.$imConn.getUniqueId();         // 生成本地消息id
        let msg = new WebIM.message('txt', id); // 创建文本消息
        let option = {
          msg: filterMsg,          // 消息内容
          to: _this.toImId,              // 接收消息对象(聊天室id)
          roomType: false,
          ext: {},                         // 扩展消息
          success: function () {
            _this.sendMessageSuccessful(messageContext, 'txt');
          },
          fail: function () {
            console.log("Send private text error");
          }                                // 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
        };
        msg.set(option);
        this.$imConn.send(msg.body);
        this.msgBold = null;
        this.clearMsg()

      },
      // 通过id获取图片详细信息
      fetchIdToFile(_fileId) {
        return this.pasteImgList.filter(item => {
          return Object.keys(item)[0] === _fileId
        })
      },

      // 查询文本框中是否存在图片 如果是的话则将其转化成贴图消息发送
      sendPasteImg(_msg) {
        const _this = this
        let regImg = /img:\[?(.*?)\].*?/gi
        console.log('获取图片')
        return _msg.replace(regImg, function (match, params) {
          console.log('图片' + params)
          try {
            const imgFile = _this.fetchIdToFile(params)[0]
            var id = _this.$imConn.getUniqueId() // 生成本地消息id
            var msg = new _this.$WebIM.message('img', id) // 创建图片消息
            msg.set({
              apiUrl: _this.$WebIM.config.apiURL,
              file: {data: imgFile[params], url: params},
              to: '', // 接收消息对象
              roomType: false,
              onFileUploadError: function (error) {
                console.log(error)
              },
              onFileUploadComplete: function (data) {
                console.log(data)
                // let localFile = {}
                // localFile[]
                _this.localImgUrlObjct[params] = `<img src="${data.uri}/${data.entities[0].uuid}" />`
                console.log('Complete')
              },
              success: function (id) {
                console.log(id)
                console.log('Success')
                _this.scrollBottom()
              }
            })
            _this.$imConn.send(msg.body)
            return ''
          } catch (error) {
            return params
          }
        })
      },
      // 文件包括图片消息回调
      autoSendFileChange(__this, _type) {
        const _this = this;
        const id = _this.$imConn.getUniqueId() // 生成本地消息id
        const file = _this.$WebIM.utils.getFileUrl(__this.target);
        let msg = new _this.$WebIM.message(_type, id) // 创建图片消息
        msg.set({
          apiUrl: _this.$WebIM.config.apiURL,
          file: file,
          to: _this.toImId, // 接收消息对象
          roomType: false,
          ext: {
            file_length: file.data.size
          },
          onFileUploadError: function () { // 消息上传失败
            console.log('onFileUploadError')
          },
          onFileUploadComplete: function (data) { // 消息上传成功
            if (_type === 'img') {
              _this.localImgUrlObjct[id] = `<img src="${data.uri}/${data.entities[0].uuid}" />`
            } else if (_type === 'file') {
              _this.localImgUrlObjct[id] = `<a href="${data.uri}/${data.entities[0].uuid}" download="${data.uri}/${data.entities[0].uuid}" style="display: flex; width: 150px; height: 80px; border-radius: 5px; justify-content: center; align-items: center; flex-direction: column; color: #1281fc; background: #fff;"><i class="iconfont icon-nav_article1" style="font-size: 30px"></i><span style="font-size: 14px">Click Me Download File</span></a>`
            } else if (_type === 'audio') {
              _this.localImgUrlObjct[id] = `<audio src="${data.uri}/${data.entities[0].uuid}" controls><source src="${data.uri}/${data.entities[0].uuid}" type="audio/mp3" /></audio>`
            } else if (_type === 'video') {
              _this.localImgUrlObjct[id] = `<video src="${data.uri}/${data.entities[0].uuid}" controls><source src="${data.uri}/${data.entities[0].uuid}" type="video/mp4" /></video>`
            }
          },
          success: function () { // 消息发送成功
            _this.sendMessageSuccessful(_this.localImgUrlObjct[id], _type);
            __this.target.value = null
          },
          flashUpload: _this.$WebIM.flashUpload
        })
        _this.$imConn.send(msg.body)
      },

      scrollBottom() {
        const _this = this;
        if (_this.messageList && _this.messageList.length > 3) {
          setTimeout(() => {
            if (_this.$refs.messageBox.scrollHeight) {
              _this.$refs.messageBox.scrollTop = _this.$refs.messageBox.scrollHeight
            }
          }, 600)
        }
      },
      addEmoji(_emoji) {
        if (_emoji.type === 'img') {
          this.$refs['execInput'].focus();
          document.execCommand('insertImage', false, _emoji.img)
        } else if (_emoji.type === 'emoji') {
          this.$refs['execInput'].innerHTML += _emoji.emoji
          this.msgBold = this.$refs['execInput'].innerHTML
        }
      },

      // 去除HTML tag
      formatHTML(_string) {
        _string = _string.replace(/<\/?.+?>/g, '')
        _string = _string.replace(/(\n)/g, '')
        _string = _string.replace(/(\t)/g, '')
        _string = _string.replace(/(\r)/g, '')
        _string = _string.replace(/<\/?[^>]*>/g, '')
        _string = _string.replace(/\s/g, ' ')
        _string = _string.replace(/&nbsp;/g, ' ')
        _string = _string.replace(/&rsquo;/g, '’')
        _string = _string.replace(/&lsquo;/g, '‘')
        _string = _string.replace(/&hellip;/g, '…')
        _string = _string.replace(/&ndash;/g, '–')
        _string = _string.replace(/&mdash;/g, '—')
        _string = _string.replace(/&sbquo;/g, '‚')
        _string = _string.replace(/&ldquo;/g, '“')
        _string = _string.replace(/&rdquo;/g, '”')
        _string = _string.replace(/&bdquo;/g, '„')
        _string = _string.replace(/&dagger;/g, '†')
        _string = _string.replace(/&Dagger;/g, '‡')
        _string = _string.replace(/&bull;/g, '•')
        _string = _string.replace(/&permil;/g, '‰')
        _string = _string.replace(/&prime;/g, '′')
        _string = _string.replace(/&Prime;/g, '″')
        _string = _string.replace(/&lsaquo;/g, '‹')
        _string = _string.replace(/&rsaquo;/g, '›')
        _string = _string.replace(/&oline;/g, '‾')
        _string = _string.replace(/&frasl;/g, '⁄')
        console.log(_string)
        return _string
      },

      sendMessageSuccessful(data, type) {
        console.log('Success');
        let user = {};
        user.to = this.toImId;  // headUrl hxUserName neckName isMySelf
        user.from = window.imOptions.user;
        user.fromHead = this.currentUserHeader;
        user.fromName = this.currentUserName;
        if (this.item) {
          user.toHead = this.item.purchaserHeadImg;
          user.toName = this.item.purchaserPhone;
        } else {
          let listTem = getIMList(this.toImId);
          if (listTem && listTem.length) {
            let obj = listTem[0];
            if (obj.isMySelf) {
              user.toHead = obj.toHead;
              user.toName = obj.toName;
            } else {
              user.toHead = obj.fromHead;
              user.toName = obj.fromName;
            }
          } else {
            user.toHead = "";
            user.toName = "";
          }
        }
        user.isMySelf = true;
        user.time = getCurrentTime();
        user.data = data;
        user.msgType = type;
        user.contactMan = this.toImId;
        this.messageList.push(user);

        //存储用户的聊天信息
        let obj = {};
        obj.to = this.toImId;
        obj.from = window.imOptions.user;
        obj.messageList = this.messageList;
        obj.unRead = 0;
        obj.contactMan = this.toImId;//当前和谁联系;
        saveIMMsg(obj);

        if (!this.item) {
          this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            let imList = getAllIMList();
            if (imList && imList.length) {
              this.connectList = [];
              for (let item of imList) {
                this.connectList.push(item.messageList[item.messageList.length - 1]);
              }
              if (this.connectList.length) {
                this.selectChatObj(this.connectList[0]);
              }
            }
          }, 1000);
        }

        this.timer1 = setTimeout(() => {
          clearTimeout(this.timer1);
          this.scrollBottom()
        }, 500);
      },
      loadData() {
        if (this.item) {
          if (this.item.purchaserImId) {
            this.toImId = this.item.purchaserImId;
          }
        }
        let mesList = getIMList(this.toImId);
        this.messageList = mesList;
        if (mesList && mesList.length) {
          this.scrollBottom();
          console.log('-------getIMList--------');
        }
        ;
        if (!this.item) {
          let imList = getAllIMList();
          if (imList && imList.length) {
            this.connectList = [];
            for (let item of imList) {
              let lastItem = item.messageList[item.messageList.length - 1];
              lastItem.unRead = item.unRead;
              this.connectList.push(lastItem);
            }
            if (this.connectList.length) {
              this.selectChatObj(this.connectList[0]);
            }
          }
        }
      },
    },

    mounted() {
      this.initEmoji(this.$WebIM);
      this.currentUserHeader = JSON.parse(localStorage.getItem('userInfo')).avatar;
      this.currentUserName = JSON.parse(localStorage.getItem('userInfo')).mobile;
      if (!window.isLoginIM) { //防止掉线
        loginIM();
      }

      this.loadData();
      let _this = this;
      connect.$on('reloadDataMsgList', () => {
        _this.loadData();
      });
    }
  }
</script>
<style lang="sass" scoped>
  .message-container
    // 主容器
    .main-container
      width: 1040px
      height: 700px
      display: flex
      border-radius: 5px
      box-shadow: 1px 1px 10px -1px #999
      position: relative
      overflow: hidden
      z-index: 99
      // 左侧控制面板
      .contact-left-list
        width: 248px
        flex: 0 0 248px
        height: 100%
        background-color: #1281FC
        display: flex
        flex-direction: row
      // 左侧列表类型选择
      .contack-content-left
        width: 300px
        background-color: #FFF
        .item-check
          width: 100%
          height: 70px
          padding: 10px 15px 0 8px
      // 右侧内容区
      .contack-right-content
        flex: 1
        display: flex
        flex-direction: column
        background-color: #fff
        .contack-user-name-tools-bar
          height: 80px
          padding: 0 20px
          background-color: #FFF
          display: flex
          width: 100%
          justify-content: space-between
          align-items: center
          color: #3D91FF
          font-size: 15px
          .contack-right-content-header
            background-color: #fff
            height: 60px
            display: flex
            justify-content: space-between
            padding: 0 20px
            border-bottom: 1px solid #E0E0E0
            .title
              color: #444444
              font-size: 24px
              align-self: center
            .tools
              align-self: center
              cursor: pointer
              > span i
                font-size: 30px
                font-weight: bold
          .contack-right-new-friend-list
            flex: 1
            background-color: #fff
            max-height: calc(100% - 60px)
            overflow-y: scroll
            .new-card-friend
              height: 120px
              display: flex
              align-items: center
              padding: 30px
              .author-img
                height: 60px
                width: 60px
                border-radius: 50%
                overflow: hidden
                img
                  max-width: 100%
              .card-content
                padding: 0 10px
                flex: 1
                .theme-color
                  color: #1281FC
              .tools
                flex: 0 0 120px
                display: flex
                align-items: center
                justify-content: center
                .agree-btn
                  background-color: #1281FC
                  border: 1px solid #1281FC
                  height: 40px
                  width: 100px
                  line-height: 40px
                  justify-content: center
                  color: #fff
                  text-align: center
                  cursor: pointer
                  &:hover
                    background-color: #fff
                    border-color: #1281FC
                    color: #1281FC
          .tools
            i
              cursor: pointer
              position: absolute
              right: 10px
              top: 10px
              font-size: 30px
              font-weight: bold
          .info-card-desc
            flex: 1
            display: flex
            justify-content: center
            align-items: center
            .info-author-img
              display: flex
              flex-direction: column
              align-items: center
              .img
                width: 200px
                height: 200px
                overflow: hidden
                border-radius: 50%
                margin: 5px 0
                img
                  width: 100%
              .user-name
                color: #444
                font-size: 36px
                text-align: center
                margin: 5px 0
              .btn-tools
                display: flex
                justify-content: space-between
                margin: 5px 0
                .btn-delete,
                .btn-contact
                  background-color: #F3F4F6
                  color: #444
                  font-size: 14px
                  width: 100px
                  height: 30px
                  border-radius: 15px
                  line-height: 30px
                  text-align: center
                  margin: 0 10px
                  cursor: pointer
                .btn-contact
                  color: #1281FC
      .contack-content
        display: flex
        flex: 1
        background-color: #fff
        width: 100%
        max-height: calc(-80px + 100%)
        .contack-message-container
          flex: 1
          display: flex
          flex-direction: column
          .contack-message-content
            display: flex
            flex: 1
            flex-direction: column
            max-height: calc(-215px + 100%)
            background-color: #F1F3FA
            .contack-message-content-fixed-power
              height: 40px
              margin: 10px
              background-color: #FFF
              display: flex
              justify-content: space-between
              padding: 0 5px
              align-items: center
              flex: 0 0 40px
              .contack-message-content-fixed-power-left
                width: 16px
                height: 16px
                margin: 0 5px
              .contack-message-content-fixed-power-title,
              .contack-message-content-fixed-power-close
                color: #333333
                font-size: 16px
                cursor: pointer
            .contack-message-content-list-box
              flex: 1
              padding: 0 10px
              overflow-y: scroll
              overflow-x: hidden
              &::-webkit-scrollbar
                width: 0px
                height: 0px
              &::-webkit-scrollbar-thumb
                border-radius: 0px
                -webkit-box-shadow: 0
                background: #1281FC
              &::-webkit-scrollbar-track
                // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2)
                border-radius: 0
                background: transparent
              .current-user-message-list-box
                height: 100%
                .current-user-message-item
                  display: flex
                  margin: 15px 0
                  .user-author-img
                    width: 30px
                    height: 30px
                    margin: 5px
                    display: flex
                    align-items: center
                    .author-img
                      border-radius: 50%
                      max-width: 100%
                      height: 100%
                  .message-card-item-house-info
                    display: flex
                    flex-direction: column

                    .message-content-style
                      padding: 10px 10px
                      border-radius: 5px
                    > span
                      color: #999999
                      font-size: 14px
                      margin: 10px 0
                  &.message-left
                    justify-content: flex-start
                    .message-card-item-house-info
                      margin-left: 35px
                      .message-content-style
                        background-color: #3863FF
                        position: relative
                        &::before
                          width: 0
                          height: 0
                          border-top: 1px solid transparent
                          border-right: 10px solid #3863FF
                          border-bottom: 5px solid transparent
                          content: ''
                          position: absolute
                          left: -10px
                          top: 50%
                          transform: translateY(-5px)
                        .message-html-content
                          color: #FFF
                          font-size: 15px
                          display: flex
                          flex-wrap: wrap
                          align-items: center
                          /deep/ img,
                          /deep/ video,
                          /deep/ audio
                            max-width: 100%
                            max-height: 300px
                      > span
                        text-align: left
                  &.message-right
                    justify-content: flex-start
                    flex-direction: row-reverse
                    .message-card-item-house-info
                      margin-right: 35px
                      .message-content-style
                        background-color: #FEFEFF
                        position: relative
                        &::before
                          width: 0
                          height: 0
                          border-top: 1px solid transparent
                          border-left: 10px solid #FEFEFF
                          border-bottom: 5px solid transparent
                          content: ''
                          position: absolute
                          right: -10px
                          top: 50%
                          transform: translateY(-5px)
                        .message-html-content
                          color: #3863FF
                          display: flex
                          flex-wrap: wrap
                          align-items: center
                          /deep/ img,
                          /deep/ video,
                          /deep/ audio
                            max-width: 100%
                            max-height: 300px
                      > span
                        text-align: right
          .contack-message-insert
            height: 215px
            flex: 0 0 215px
            display: flex
            flex-direction: column
            .contack-message-insert-tools-bar
              height: 40px
              display: flex
              justify-content: space-between
              .tools-bar-box,
              .contack-message-insert-history
                display: flex
                align-items: center
                margin: 0 10px
                .tools-item
                  font-size: 0
                  margin: 0 5px
                  cursor: pointer
                  > input
                    display: none
                  i
                    cursor: pointer
                    font-size: 22px
                .tools-btn-history
                  cursor: pointer
                  font-size: 14px
                  color: #444
                  padding: 5px
                  &:hover, &.active
                    background-color: #E0E0E0
                  > i
                    marign-right: 5px
            > cite
              flex: 1
              padding: 10px 20px
              font-style: normal
              word-break: break-word
              overflow-y: scroll
              overflow-x: hidden
              height: inherit
              max-height: calc(215px - 40px - 64px)
              outline: none
              // display: flex
              // flex-wrap: wrap
              // align-items: center
              &::-webkit-scrollbar
                width: 0px
                height: 0px
              &::-webkit-scrollbar-thumb
                border-radius: 0px
                -webkit-box-shadow: 0
                background: #1281FC
              &::-webkit-scrollbar-track
                // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2)
                border-radius: 0
                background: transparent
              /deep/ img, video, audio
                max-width: 200px
            .contack-message-buttom-btn
              height: 65px
              display: flex
              align-items: center
              justify-content: flex-end
              .contack-message-buttom-btn-close,
              .contack-message-buttom-btn-send
                padding: 10px 25px
                color: #fff
                background-color: #1281FC
                margin-right: 10px
                font-size: 14px
                cursor: pointer


</style>


<style lang="sass">
  // Emoji
  .Emoji
    width: 280px
    border: none !important
    padding: 0
    border-color: none !important
    .popper__arrow
      display: none !important
    .emojiType
      .tab-customer-emoji
        .el-tabs__content
          padding: 10px
        .el-tabs__nav
          display: flex
          .el-tabs__item
            display: flex
            align-items: center
          .label-sty
            display: flex
            align-items: center
            font-size: 24px
            img
              width: 32px
              height: 32px
        .tab-emoji
          max-height: 200px
          overflow-y: scroll
          height: 200px
          &::-webkit-scrollbar
            width: 0px
            height: 0px
          &::-webkit-scrollbar-thumb
            border-radius: 0px
            -webkit-box-shadow: 0
            background: #1281FC
          &::-webkit-scrollbar-track
            // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2)
            border-radius: 0
            background: transparent
          .emoji-box
            display: flex
            flex-wrap: wrap
            .emoji-item
              cursor: pointer
              height: 32px
              width: 32px
              display: flex
              align-items: center
              justify-content: center
              &:hover
                background-color: gainsboro
              span
                font-size: 24px
</style>

<style lang="scss" scoped>
</style>

