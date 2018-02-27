const PLATFORM_IOS = 'IOS';
const PLATFORM_ANDROID = 'ANDROID';

export default class MetaWebviewSceneInterface {
  constructor(onConnect) {
    this.isReady = false;
    this.platform = undefined;
    this.messageQueue = [];

    this.onConnect = onConnect;

    if (window.MetaiOSReady) {
      this.isReady = true;
      this.platform = PLATFORM_IOS;
      this.didConnect();
    }

    if (window.MetaAndroidReady) {
      this.isReady = true;
      this.platform = PLATFORM_ANDROID;
      this.didConnect();
    }

    window.addEventListener('MetaiOSReady', () => {
      this.isReady = true;
      this.platform = PLATFORM_IOS;
      this.didConnect();
    });

    window.addEventListener('MetaAndroidReady', () => {
      this.isReady = true;
      this.platform = PLATFORM_ANDROID;
      this.didConnect();
    });
  }

  postMessage(rawMessage) {
    console.log('sending ios');
    const message = JSON.stringify(rawMessage || '');

    switch (this.platform) {
      case PLATFORM_ANDROID:
        window.postMetaMessage(message);
        break;
      case PLATFORM_IOS:
        window.webkit.messageHandlers.messageHandler.postMessage(message);
        break;
      default:
        this.messageQueue.push(message);
        break;
    }
  }

  didConnect() {
    if (this.onConnect) {
      this.onConnect();
    }

    // Process any messages in the queue
    this.messageQueue.forEach((message) => {
      this.postMessage(message);
    });

    this.messageQueue = [];
  }

  share(data) {
    this.postMessage({
      action: 'share',
      text: data.text || '',
      image: data.image || '',
      url: data.url || '',
    });
  }

  processDefaultTransition() {
    this.postMessage({
      action: 'transition',
    });
  }
}
