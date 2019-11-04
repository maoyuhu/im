
import websdk from 'easemob-websdk'
import config from './WebIMConfig'
import {formatDate} from "./Utils";
import {saveIMMsg, getIMList, loginIM, getUserByIm, removeImTryCount, saveImTryCount, imTryCount} from "./webImTool";
import connect from './eventBus'

let WebIM = window.WebIM || {};
let isLoginIM = window.isLoginIM || false; //当前用户是否登录环信
WebIM.Emoji = {
  path: '/static/img/faces/',
  map: {
    '[):]': 'ee_1.png',
    '[:D]': 'ee_2.png',
    '[;)]': 'ee_3.png',
    '[:-o]': 'ee_4.png',
    '[:p]': 'ee_5.png',
    '[(H)]': 'ee_6.png',
    '[:@]': 'ee_7.png',
    '[:s]': 'ee_8.png',
    '[:$]': 'ee_9.png',
    '[:(]': 'ee_10.png',
    '[:\'(]': 'ee_11.png',
    '[:|]': 'ee_12.png',
    '[(a)]': 'ee_13.png',
    '[8o|]': 'ee_14.png',
    '[|]': 'ee_15.png',
    '[+o(]': 'ee_16.png',
    '[<o)]': 'ee_17.png',
    '[|-)]': 'ee_18.png',
    '[*-)]': 'ee_19.png',
    '[:-#]': 'ee_20.png',
    '[:-*]': 'ee_21.png',
    '[^o)]': 'ee_22.png',
    '[8-)]': 'ee_23.png',
    '[(|)]': 'ee_24.png',
    '[(u)]': 'ee_25.png',
    '[(S)]': 'ee_26.png',
    '[(*)]': 'ee_27.png',
    '[(#)]': 'ee_28.png',
    '[(R)]': 'ee_29.png',
    '[({)]': 'ee_30.png',
    '[(})]': 'ee_31.png',
    '[(k)]': 'ee_32.png',
    '[(F)]': 'ee_33.png',
    '[(W)]': 'ee_34.png',
    '[(D)]': 'ee_35.png'
  }
}
WebIM.NewEmoji = {
  map: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😵', '🤯', '🤠', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹', '😮', '😯', '😲', '😳', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '💋', '👋', '🤚', '🖐', '✋', '🖖', '👌', '✌', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍', '💅', '🤳', '💪', '👂', '👃', '🧠', '👀', '👁', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👱‍', '👨‍', '👨‍', '👨‍', '👨‍', '👩', '👱‍', '👩‍', '👩‍', '👩‍', '👩‍', '🧓', '👴', '👵', '🙍', '🙍‍', '🙍‍', '🙎', '🙎‍', '🙎‍', '🙅', '🙅‍', '🙅‍', '🙆', '🙆‍', '🙆‍', '💁', '💁‍', '💁‍', '🙋', '🙋‍', '🙋‍', '🙇', '🙇‍', '🙇‍', '🤦', '🤦‍', '🤦‍', '🤷', '🤷‍', '🤷‍', '👨‍⚕️', '👩‍⚕️', '👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '👨‍⚖️', '👩‍⚖️', '👨‍🌾', '👩‍🌾', '👨‍🍳', '👩‍🍳', '👨‍🔧', '👩‍🔧', '👨‍🏭', '👩‍🏭', '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬', '👨‍💻', '👩‍💻', '👨‍🎤', '👩‍🎤', '👨‍🎨', '👩‍🎨', '👨‍✈️', '👩‍✈️', '👨‍🚀', '👩‍🚀', '👨‍🚒', '👩‍🚒', '👮', '👮‍♂️', '👮‍♀️', '🕵Det', '🕵️‍♂️', '🕵️‍♀️', '💂', '💂‍', '💂‍', '👷', '👷‍', '👷‍', '🤴', '👸', '👳', '👳‍', '👳‍', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🧙', '🧙‍', '🧙‍', '🧚', '🧚‍', '🧚‍', '🧛', '🧛‍', '🧛‍', '🧜', '🧜‍', '🧜‍', '🧝', '🧝‍', '🧝‍', '🧞', '🧞‍', '🧞‍', '🧟', '🧟‍', '🧟‍', '💆', '💆‍', '💆‍', '💇', '💇‍', '💇‍', '🚶', '🚶‍', '🚶‍', '🏃', '🏃‍', '🏃‍', '💃', '🕺', '🕴', '👯', '👯‍', '👯‍', '🧖', '🧖‍', '🧖‍', '🧘', '👭', '👫', '👬', '💏', '👨‍', '👩‍', '💑', '👨‍', '👩‍', '👪', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👦', '👨‍👦‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👧‍👧', '👩‍👦', '👩‍👦‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👧‍👧', '🗣', '👤', '👥', '👣', '🌂', '☂', '👓', '🕶', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '👠', '👡', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑', '💄', '💍', '💼']
}

var conn = {};
WebIM.config = config;
conn = WebIM.conn = new websdk.connection({
  appKey: WebIM.config.appkey,
  isHttpDNS: WebIM.config.isHttpDNS,
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: WebIM.config.https,
  url: WebIM.config.xmppURL,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: false,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  isStropheLog: WebIM.config.isStropheLog,
  delivery: WebIM.config.delivery
})


// for downward compatibility
if (!conn.apiUrl) {
  conn.apiUrl = WebIM.config.apiURL
}
try {
  conn.listen({
    // 连接成功回调
    onOpened: function (message) {
      window.isLoginIM = true;
      // removeImTryCount();
      console.log('------------>>>>>>>连接成功<<<<<<<<<----------------')
      console.log('当前登录用户----' + window.imOptions.user);
    },

    // 收到文本消息
    onTextMessage: function (message) {
      console.log(message);
      receiveMessageSuccessful(message, 'txt');
    },
    // 收到表情信息
    onEmojiMessage: function (message) {
      // 处理表情消息
      let msgType = 'txt';
      message.data = message.data.map(item => {
        if (item.type === 'emoji') {
          msgType = 'img';
          return `<img src="${item.data}" data-emoji="${item.data}" data-type="${item.type}"/>`
        } else {
          msgType = 'txt';
          return item.data
        }
      }).join('')
      console.log(message);
      receiveMessageSuccessful(message, msgType);
    },
    // 收到图片消息
    onPictureMessage: function (message) {
      console.log(message);
      message.data = `<img src="${message.url}" />`;
      receiveMessageSuccessful(message, 'img');
    },

    // 收到联系人订阅请求、处理群组、聊天室被踢解散等消息
    onPresence: function (e) {
      // console.log(message)
      // （发送者希望订阅接收者的出席信息），即别人申请加你为好友
      if (e.type === 'subscribe') {
        console.log(e)
        // 更新未处理好友列表
      }

      // (发送者允许接收者接收他们的出席信息)，即别人同意你加他为好友
      if (e.type === 'subscribed') {
        console.log(e)
      }

      // （发送者取消订阅另一个实体的出席信息）,即删除现有好友
      if (e.type === 'unsubscribe') {
        console.log(e)
      }

      // （订阅者的请求被拒绝或以前的订阅被取消），即对方单向的删除了好友
      if (e.type === 'unsubscribed') {
        console.log(e)
      }
    },

    // 消息回执
    onDeliveredMessage(message) {
      console.log('消息回执')
      console.log(message)
    },
    onAudioMessage: function (message) {
      console.log('音频消息')
      console.log(message)
      message.data = `<audio src="${message.url}" controls><source src="${message.url}" type="audio/mp3" /></audio>`
    }, // 收到音频消息
    onLocationMessage: function (message) {
      console.log('当前关闭')
    }, // 收到位置消息
    onFileMessage: function (message) {
      console.log('文件消息')
      console.log(message)
      message.data = `<a href="${message.url}" download="${message.url}" style="display: flex; width: 150px; height: 80px; border-radius: 5px; justify-content: center; align-items: center; flex-direction: column; color: #1281fc; background: #fff;"><i class="iconfont icon-nav_article1" style="font-size: 30px"></i><span style="font-size: 14px">Click Me Download File</span></a>`
    }, // 收到文件消息
    onVideoMessage: function (message) {
      console.log('视频消息')
      console.log(message)
      message.data = `<video src="${message.url}" controls><source src="${message.url}" type="audio/mp4" /></video>`
    }, // 收到视频消息
    onInviteMessage: function (message) {
      console.log('当前关闭')
    }, // 处理群组邀请
    onOnline: function () {
      console.log('当前关闭')
    }, // 本机网络连接成功
    onOffline: function () {
      console.log('当前关闭')
    }, // 本机网络掉线
    // 失败回调
    onError: function (message) { //206=被挤掉   //16=断开连接
      console.log(message);
      console.log('登录失败或者失效---------------->');
      window.isLoginIM = false;
      let tryCount = imTryCount();
      if (tryCount < 5) {
        console.log(`连续尝试${tryCount}次`);
        let timer = setTimeout(() => {
          loginIM();
          saveImTryCount();
          clearTimeout(timer);
        }, 3000);
      }
    }
  });
} catch (e) {
  debugger
  console.log(e)
}


export function receiveMessageSuccessful(message, type) {
  let toHead = JSON.parse(localStorage.getItem('userInfo')).avatar;
  let toName = JSON.parse(localStorage.getItem('userInfo')).mobile;
  let user = {};
  user.to = message.to;  // headUrl hxUserName neckName isMySelf
  user.from = message.from;
  user.toHead = toHead;
  user.toName = toName;
  user.isMySelf = false;
  user.time = formatDate(parseInt(message.time));
  user.data = message.data;
  user.msgType = type;
  user.contactMan = message.from;
  getUserByIm(message.from, (data) => {
    user.fromHead = data.headImg;
    user.fromName = data.name ? data.name : user.from;
    let msgList = getIMList(message.to);
    msgList.push(user);
    //存储用户的聊天信息
    let obj = {};
    obj.to = message.to;
    obj.from = message.from;
    obj.contactMan = message.from;
    obj.unRead = 1;
    obj.messageList = msgList;
    saveIMMsg(obj);
    let timer = setTimeout(() => {
      connect.$emit('reloadDataMsgList');
      clearTimeout(timer);
    }, 2000);
  });
};

const imOptions = {
  apiUrl: WebIM.config.apiURL,
  user: null,
  pwd: '123456',
  appKey: WebIM.config.appkey
}
// 全局注册WebIM
window.WebIM = WebIM;

window.imOptions = imOptions;
// conn.open(imOptions)

export default {
  install: function (Vue, options) {
    // console.log(WebIM)
    Object.defineProperty(Vue.prototype, '$WebIM', {value: WebIM})
    Object.defineProperty(Vue.prototype, '$imConn', {value: conn})
    // Object.defineProperty(Vue.prototype, '$rtcCall', { value: rtcCall })
    Object.defineProperty(Vue.prototype, '$WebImOptions', {value: imOptions})
  }
}
