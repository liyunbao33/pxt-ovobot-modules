/**
 * Provides access to basic micro:bit functionality.
 */

enum ModuleIndex {
    //% block="module1"
    Module1,
    //% block="module2"
    Module2,
    //% block="module3"
    Module3,
    //% block="module4"
    Module4
}

enum TouchIndex {
    //% block="1"
    T1,
    //% block="2"
    T2,
}

enum KeyIndex {
    //% block="1"
    T1,
    //% block="2"
    T2,
    //% block="3"
    T3,
    //% block="4"
    T4
}

enum PressIndex {
    //% block="1"
    T1,
    //% block="2"
    T2
}

enum SubIndex { 
    //% block="1"
    subModule1 = 1,
    //% block="2"
    subModule2,
    //% block="3"
    subModule3,
    //% block="4"
    subModule4
}

enum MesureContent {
    //% block="onboard temp"
    TempOnBoard,
    //% block="onboard humidity"
    HmOnBoard,
    //% block="extend temp"
    TempOffBoard
}

enum LedIndex {
    //% block="all"
    All,
    //% block="1"
    L1,
    //% block="2"
    L2,
    //% block="3"
    L3,
    //% block="4"
    L4,
    // //% block="5"
    // L5,
    // //% block="6"
    // L6,
    // //% block="7"
    // L7,
    // //% block="8"
    // L8,
    // //% block="9"
    // L9,
    // //% block="10"
    // L10,
    // //% block="11"
    // L11,
    // //% block="12"
    // L12  
}

enum TouchLedIndex {
    //% block="all"
    All,
    //% block="1"
    L1,
    //% block="2"
    L2,
    //% block="3"
    L3,
    //% block="4"
    L4,
    //% block="5"
    L5,
    //% block="6"
    L6,
    //% block="7"
    L7,
    //% block="8"
    L8,
    // //% block="9"
    // L9,
    // //% block="10"
    // L10,
    // //% block="11"
    // L11,
    // //% block="12"
    // L12  
}


enum Color {
    //% block="red"
    Red,
    //% block="orange"
    Orange,
    //% block="yellow"
    Yellow,
    //% block="green"
    Green,
    //% block="blue"
    Blue,
    //% block="indigo"
    Indigo,
    //% block="purple"
    Purple,
    //% block="white"
    White,
    //% block="black"
    Black
}

enum VoicePerson {
    //% block="standardFemaleVoice"
    standardFemaleVoice,
    //% block="standardMaleVoice"
    standardMaleVoice,
    //% block="magnetismMaleVoice"
    magnetismMaleVoice,
    //% block="standardchildVoice"
    standardchildVoice,
}

enum SpeechLang {
    //% block="Chinese"
    chinese,
    //% block="English"
    english,
}

//% color=190 weight=100 icon="\uf1ec" block="Ovobot Modules"
namespace ovobotModules {
    const SONAR_ADDRESS = 0x52
    const MOTOR_ADDRESS = 0x64
    const SERVO_ADDRESS = 0x74
    const LED_ADDRESS = 0x53
    const SEG_ADDRESS = 0x6C
    const TOUCHKEY_ADDRESS = 0x70
    const RGB_TOUCHKEY_ADDRESS = 0x4C
    const TEMP_ADDRESS = 0x5c
    const IOT_ADDRESS = 0x50
    const PM_ADDRESS = 0x60
    const SPEECH_ADDRESS = 0x69
    const SOIL_ADDRESS = 0x48
    const LINE_ADDRESS = 0x51
    const COLOR_ADDRESS = 0x40
    const RGB_ADDRESS = 0x3C
    const PRESS_ADDRESS = 0x34
    const HOARE_ADDRESS = 0x44
    const INF_ADDRESS = 0x28
    const LOUDNESS_ADDRESS = 0x38
    const LED_DISPLAY_TEMP_ADDRESS = 0x2C
    const KEY_ADDRESS = 0x30
    const lowBright = 8
    const selectColors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0x800080, 0xffffff, 0x000000]
    let tempDevEnable = [false, false, false, false]
    let neopixelBuf = pins.createBuffer(14);
    let neopixeBuf = pins.createBuffer(26);
    function sonicEnable() {
        pins.i2cWriteRegister(SONAR_ADDRESS, 0x00, 0x01);
    }

    // 将字符串格式化为UTF8编码的字节
    let writeUTF = function (str:String, isGetBytes?:boolean) {
        let back = [];
        let byteSize = 0;
        let i = 0;
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            if (0x00 <= code && code <= 0x7f) {
                byteSize += 1;
                back.push(code);
            } else if (0x80 <= code && code <= 0x7ff) {
                byteSize += 2;
                back.push((192 | (31 & (code >> 6))));
                back.push((128 | (63 & code)))
            } else if ((0x800 <= code && code <= 0xd7ff) 
                    || (0xe000 <= code && code <= 0xffff)) {
                byteSize += 3;
                back.push((224 | (15 & (code >> 12))));
                back.push((128 | (63 & (code >> 6))));
                back.push((128 | (63 & code)))
            }
        }
        for (i = 0; i < back.length; i++) {
            back[i] &= 0xff;
        }
        return back;
        
    }

    function constract(val: number, minVal: number, maxVal: number): number {
        if (val > maxVal) {
            return maxVal;
        } else if (val < minVal) {
            return minVal;
        }
        return val;
    }

    function tempEnable(address: number, index: number) { 
        pins.i2cWriteRegister(address, 0x00, 0x01);
        tempDevEnable[index] = true;
    }

    function validate(str: String): Boolean { 
        let isfloat = false;
        let len = str.length;
        if (len > 5) { 
            return false;
        }
        for (let i = 0; i < len; i++) { 
            if (str.charAt(i) == ".") { 
                isfloat = true;
                return true;
            }
        }
        if (!isfloat && len == 5) { 
            return false;
        }
        return true;
    }

    /**
     * TODO: 获取超声波传感器与前方障碍物的距离函数。
     */
    //% block weight=50
    export function readDistance(): number {
        sonicEnable();

        let sonarVal = pins.i2cReadRegister(SONAR_ADDRESS, 0x01, NumberFormat.Int16LE);
        let distance = sonarVal / 29;

        return distance;
    }

    /**
     * TODO: 控制马达PWM输出。
     */
    //% block="control motor %module  output %speed"
    //% speed.min=-255 speed.max=255
    //% weight=65
    export function controlMotorOutput(module: ModuleIndex, speed: number) {
        let buf = pins.createBuffer(8);
        buf[0] = 0x00;
        buf[1] = speed > 0 ? 0 : 1;
        buf[2] = Math.abs(speed)

        pins.i2cWriteBuffer(MOTOR_ADDRESS + module, buf);
    }

    /**
     * TODO: 连接MQTT。
     */
    //% block="link mqtt"
    //% weight=65
    export function linkMqtt() {
        pins.i2cWriteRegister(IOT_ADDRESS, 0x50, 0x01);
    }




    /**
     * TODO: 控制舵机旋转。
     */
    //% block="control servo %module index %submod  rotate to %angle"
    //% angle.min=-90 angle.max=90
    //% weight=65
    export function controlServoOutput(module: ModuleIndex,submod:SubIndex, angle: number) {
        let buf = pins.createBuffer(8);
        let newangle = constract(angle, -90, 90);
        let output = 19 + 24 * angle / 180.0;
        buf[0] = 0x00;
        buf[1] = submod;
        buf[2] = output;
        pins.i2cWriteBuffer(SERVO_ADDRESS + module, buf);
    }

    /**
     * TODO: 控制RGB灯条。
     */
    //% blockId=control_leds_output block="control neopixels %index color %color"
    //% weight=65
    export function controlNeopixels(index: LedIndex, color: Color) { 
        let startPos;

        neopixelBuf[0] = 0;
        neopixelBuf[1] = 1;
        if (index == 0) {
            for (let i = 2; i < 12; i += 3) {
                neopixelBuf[i] = ((selectColors[color] >> 8) & 0xff) / lowBright;
                neopixelBuf[i + 1] = ((selectColors[color] >> 16) & 0xff) / lowBright;
                neopixelBuf[i + 2] = (selectColors[color] & 0xff) / lowBright;
            }
        } else { 
            startPos = 2 + 3 * (index-1);
            neopixelBuf[startPos] = ((selectColors[color] >> 8) & 0xff) / lowBright;
            neopixelBuf[startPos + 1] = ((selectColors[color] >> 16) & 0xff) / lowBright;
            neopixelBuf[startPos + 2] = (selectColors[color] & 0xff) / lowBright;
        }
        pins.i2cWriteBuffer(RGB_ADDRESS, neopixelBuf);
    }

    /**
     * TODO: IOT连接WIFI。
     */
    //% blockId=iot_connect_wifi block="iot connect wifi %iotstr"
    //% weight=65
    export function iotConnectWifi(iotstr: String) {
        let text = iotstr;
        let buf = pins.createBuffer(40);
        buf[0] = 0;
        buf[1] = 1;
        for (let i = 0; i < text.length; i++) {
            buf[i + 2] = text.charCodeAt(i);
        }
        buf[text.length + 2] = 0x0d;
        buf[text.length + 3] = 0x0a;
        pins.i2cWriteBuffer(IOT_ADDRESS, buf);
    }

    /**
     * TODO: 语音连接WIFI。
     */
    //% blockId=speech_connect_wifi block="speech connect wifi %speechstr"
    //% weight=65
    export function speechConnectWifi(speechstr: String) {
        let text = speechstr;
        let buf = pins.createBuffer(40);
        buf[0] = 0;
        buf[1] = 1;
        for (let i = 0; i < text.length; i++) {
            buf[i + 2] = text.charCodeAt(i);
        }
        buf[text.length + 2] = 0x0d;
        buf[text.length + 3] = 0x0a;
        pins.i2cWriteBuffer(SPEECH_ADDRESS, buf);
    }

    /**
     * TODO: 语音输入。
     */
    //% blockId=speech_input block="speech input"
    //% weight=65
    export function speechInput() {
        pins.i2cWriteRegister(SPEECH_ADDRESS, 0x2d, 0x01);
    }

    /**
     * TODO: OTA升级。
     */
    //% blockId=ota_update block="ota update"
    //% weight=65
    export function otaUpdate() {
        pins.i2cWriteRegister(IOT_ADDRESS, 0x00, 0xFF);
    }

     /**
     * TODO: 语音OTA升级。
     */
    //% blockId=speech_ota_update block="speech ota update"
    //% weight=65
    export function speechOtaUpdate() {
        pins.i2cWriteRegister(SPEECH_ADDRESS, 0x00, 0xFF);
    }

    /**
     * TODO: 语音返回。
     */
    //% blockId=speech_res block="speech res"
    //% weight=65
    export function speechRes() {
        pins.i2cWriteRegister(SPEECH_ADDRESS, 0x2e, 0x01);
    }

    /**
     * TODO: 语音输出。
     */
    //% blockId=voice_out block="voice out %sndstr"
    //% weight=65
    export function voiceOut(sndstr: String) {
        let text = sndstr;
        let buf = pins.createBuffer(100);
        buf[0] = 0x8c;
        buf[1] = 1;
        let utf8_buf = writeUTF(text);
        for (let i = 0; i < utf8_buf.length; i++) {
            buf[i + 2] = utf8_buf[i];//text.charCodeAt(i);
        }
        buf[utf8_buf.length + 2] = 0x0d;
        buf[utf8_buf.length + 3] = 0x0a;
        pins.i2cWriteBuffer(SPEECH_ADDRESS, buf);
    }

    //  /**
    //  * TODO: 语音输出。
    //  */
    // //% blockId=voice_out block="voice out"
    // //% weight=65
    // export function voiceOut() {
    //     let buf = pins.createBuffer(256);
    //     buf[0] = 0xf2;
    //     buf[1] = 1;
    //     buf[2] = 2; 
    //     buf[3] = 0xE4; 
    //     buf[4] = 0xBD;
    //     buf[5] = 0xA0;
    //     buf[6] = 0xE5;
    //     buf[7] = 0xA5;
    //     buf[8] = 0xBD;
    //     buf[9] = 0x0D;
    //     buf[10] = 0x0A;
    //     pins.i2cWriteBuffer(IOT_ADDRESS, buf);
    // }

    /**
     * TODO: 语音声源设置。
     */
    //% blockId=voice_person_set block="set %voicePerson"
    //% weight=65
    export function voicePersonSet(voicePerson: VoicePerson) {
        pins.i2cWriteRegister(IOT_ADDRESS, 0x8a, 0x01);
        if (voicePerson == 0) {
            pins.i2cWriteRegister(IOT_ADDRESS, 0x8b, 0);
        } else if (voicePerson == 1) {
            pins.i2cWriteRegister(IOT_ADDRESS, 0x8b, 1);
        } else if (voicePerson == 2) {
            pins.i2cWriteRegister(IOT_ADDRESS, 0x8b, 3);
        } else if (voicePerson == 3) {
            pins.i2cWriteRegister(IOT_ADDRESS, 0x8b, 4);
        }
    }

    /**
     * TODO: 语音识别语言设置。
     */
    //% blockId=speech_lang_set block="set %speechLang"
    //% weight=65
    export function speechLangSet(speechLang: SpeechLang) {
        pins.i2cWriteRegister(IOT_ADDRESS, 0x8b, 0x01);
        if (speechLang == 0) {
            pins.i2cWriteRegister(IOT_ADDRESS, 0x8c, 0);
        } else if (speechLang == 1) {
            pins.i2cWriteRegister(IOT_ADDRESS, 0x8c, 1);
        } 
    }

    /**
     * TODO: MQTT发布消息。
     */
    //% blockId=mqtt_pub_message block="mqtt pub %module message"
    //% weight=65
    export function mqttPubMessage(module: ModuleIndex) {
        const text = "soil,123"
        let buf = pins.createBuffer(36);
        buf[0] = 0x2c;
        buf[1] = 1;
        for (let i = 0; i < text.length; i++) {
            buf[i + 2] = text.charCodeAt(i);
        }
        buf[text.length + 2] = 0x0d;
        buf[text.length + 3] = 0x0a;
        pins.i2cWriteBuffer(IOT_ADDRESS, buf);
    }

    /**
     * TODO: MQTT订阅消息。
     */
    //% blockId=mqtt_sub_topic block="mqtt sub %substr"
    //% weight=65
    export function mqttSubTopic(substr: String) {
        const text = substr
        let buf = pins.createBuffer(20);
        buf[0] = 0x98;
        buf[1] = 1;
        for (let i = 0; i < text.length; i++) {
            buf[i + 2] = text.charCodeAt(i);
        }
        buf[text.length + 2] = 0x0d;
        buf[text.length + 3] = 0x0a;
        pins.i2cWriteBuffer(IOT_ADDRESS, buf);
    }

    /**
     * TODO: MQTT1获取订阅消息。
     */
    //% blockId=mqtt1_res_message block="mqtt1 res %module message"
    //% weight=65
    export function mqtt1ResMessage(module: ModuleIndex) {
        const text = "soil"
        let buf = pins.createBuffer(20);
        buf[0] = 0x64;
        buf[1] = 1;
        for (let i = 0; i < text.length; i++) {
            buf[i + 2] = text.charCodeAt(i);
        }
        buf[text.length + 2] = 0x0d;
        buf[text.length + 3] = 0x0a;
        pins.i2cWriteBuffer(IOT_ADDRESS, buf);
    }

    /**
     * TODO: MQTT2获取订阅消息。
     */
    //% blockId=mqtt2_res_message block="mqtt2 res %module message"
    //% weight=65
    export function mqtt2ResMessage(module: ModuleIndex) {
        const text = "water"
        let buf = pins.createBuffer(20);
        buf[0] = 0x64;
        buf[1] = 1;
        for (let i = 0; i < text.length; i++) {
            buf[i + 2] = text.charCodeAt(i);
        }
        buf[text.length + 2] = 0x0d;
        buf[text.length + 3] = 0x0a;
        pins.i2cWriteBuffer(IOT_ADDRESS, buf);
    }

    /**
     * TODO: 读物联网wifi状态。
     */
    //% blockId=read_wifi_stat block="read wifi stat"
    //% weight=65
    export function readWifiData(module: ModuleIndex): number{
        let data = pins.i2cReadRegister(IOT_ADDRESS  + module , 0x2a, NumberFormat.UInt8LE);
        return (data);
    }

    /**
     * TODO: 显示数码管数值。
     */
    //% blockId=display_seg_number block="control seg %module display number %num"
    //% weight=65
    export function displaySegNumber(module: ModuleIndex, num: number) {
        let buf = pins.createBuffer(6);
        buf[0] = 0;
        buf[1] = 1;
        buf[2] = 0;
        buf[3] = 0;
        buf[4] = 0;
        buf[5] = 0;
        let str_num = num.toString();
        let len = str_num.length;
        let j = 0;
        if (validate(str_num)) { 
            for (let i = len - 1; i >= 0; i--) { 
                if (str_num.charAt(i) == '.') {
                    buf[5 - j] = (str_num.charCodeAt(i - 1) - '0'.charCodeAt(0)) | 0x80;
                    i--;
                } else if (str_num.charAt(i) == "-") {
                    buf[5 - j] = 0x40;
                } else { 
                    buf[5 - j] = str_num.charCodeAt(i) - '0'.charCodeAt(0);
                }
                j++;
            }
            pins.i2cWriteBuffer(SEG_ADDRESS, buf);
        }
    }
    
    /**
     * TODO: 读取触摸按键。
     */
    //% blockId=read_touch block="read %module touch %index data"
    //% weight=65
    export function readTouchData(module: ModuleIndex, index: TouchIndex): number{
        pins.i2cWriteRegister(RGB_TOUCHKEY_ADDRESS, 0x00, 0x01);
        let data;
        if (index == 0) {
            data = pins.i2cReadRegister(RGB_TOUCHKEY_ADDRESS + module, 0x19, NumberFormat.UInt8LE);
        } else {
            data = pins.i2cReadRegister(RGB_TOUCHKEY_ADDRESS + module, 0x1A, NumberFormat.UInt8LE);
        }
        return (data);
    }

    /**
     * TODO: 控制触摸RGB灯条。
     */
    //% blockId=control_touch_leds_output block="control touch leds %index color %color"
    //% weight=65
    export function controlTouchLeds(index: TouchLedIndex, color: Color) { 
        let startPos;
        //let ledBuf = pins.createBuffer(26);
        neopixeBuf[0] = 0;
        neopixeBuf[1] = 1;
        if (index == 0) {
            for (let i = 2; i < 24; i += 3) {
                neopixeBuf[i] = ((selectColors[color] >> 8) & 0xff) / lowBright;
                neopixeBuf[i + 1] = ((selectColors[color] >> 16) & 0xff) / lowBright;
                neopixeBuf[i + 2] = (selectColors[color] & 0xff) / lowBright;
            }
        } else { 
            startPos = 2 + 3 * (index-1);
            neopixeBuf[startPos] = ((selectColors[color] >> 8) & 0xff) / lowBright;
            neopixeBuf[startPos + 1] = ((selectColors[color] >> 16) & 0xff) / lowBright;
            neopixeBuf[startPos + 2] = (selectColors[color] & 0xff) / lowBright;
        }
        pins.i2cWriteBuffer(RGB_TOUCHKEY_ADDRESS, neopixeBuf);
    }

    /**
     * TODO: 读取开关按键值。
     */
    //% blockId=read_key block="read %module key %index data"
    //% weight=65
    export function readKeyData(module: ModuleIndex, index: KeyIndex): number{
        pins.i2cWriteRegister(KEY_ADDRESS, 0x00, 0x01);
        let data;
        if (index == 0) {
            data = pins.i2cReadRegister(KEY_ADDRESS + module, 0x01, NumberFormat.UInt8LE);
        } else if (index == 1) {
            data = pins.i2cReadRegister(KEY_ADDRESS + module, 0x02, NumberFormat.UInt8LE);
        } else if (index == 2) {
            data = pins.i2cReadRegister(KEY_ADDRESS + module, 0x03, NumberFormat.UInt8LE);
        } else if (index == 3) {
            data = pins.i2cReadRegister(KEY_ADDRESS + module, 0x04, NumberFormat.UInt8LE);
        }
        return (data);
    }


    /**
     * TODO: 触摸按键是否接触。
     */
    //% blockId=isTouchDown block="touchkey %module is touched?"
    //% weight=65
    export function isTouchDown(module: ModuleIndex): boolean{ 
        pins.i2cWriteRegister(TOUCHKEY_ADDRESS + module, 0x00, 0x01);
        let data = pins.i2cReadRegister(TOUCHKEY_ADDRESS + module, 0x01, NumberFormat.UInt8LE);
        return (data == 1);
    }

    /**
     * TODO: 读取手柄值。
     */
    //% blockId=read_keypad block="read %module keypad data"
    //% weight=65
    export function readKeypadData(module: ModuleIndex): number{
        // pins.i2cWriteRegister(SEG_ADDRESS + module, 0x00, 0x01);
        let data = pins.i2cReadRegister(SEG_ADDRESS  + module , 0x01, NumberFormat.UInt8LE);
        return (data);
    }

    /**
     * TODO: 读取霍尔。
     */
    //% blockId=read_hoare block="read %module hoare data"
    //% weight=65
    export function readHoareData(module: ModuleIndex): number{
        pins.i2cWriteRegister(HOARE_ADDRESS + module, 0x00, 0x01);
        let data = pins.i2cReadRegister(HOARE_ADDRESS  + module , 0x01, NumberFormat.UInt8LE);
        return (data);
    }


    /**
     * TODO: 读取数码管&温湿度。
     */
    //% blockId=read_led_display_temp block="read %module led display temp data"
    //% weight=65
    export function readLedDisplayTempData(module: ModuleIndex): number{
        pins.i2cWriteRegister(LED_DISPLAY_TEMP_ADDRESS + module, 0x00, 0x01);
        let data = pins.i2cReadRegister(LED_DISPLAY_TEMP_ADDRESS  + module , 0x05, NumberFormat.UInt8LE);
        return (data);
    }

    /**
     * TODO: 读取iot_ota进度。
     */
    //% blockId=read_iot_ota_progress block="read iot ota progress data"
    //% weight=65
    export function readIotOtaProgressData(): number{
        let data = pins.i2cReadRegister(IOT_ADDRESS, 0x48, NumberFormat.UInt8LE);
        return (data);
    }

    /**
     * TODO: 读取红外。
     */
    //% blockId=read_inf block="read %module inf data"
    //% weight=65
    export function readInfData(module: ModuleIndex): number{
        pins.i2cWriteRegister(INF_ADDRESS + module, 0x00, 0x01);
        let data = pins.i2cReadRegister(INF_ADDRESS  + module , 0x01, NumberFormat.UInt8LE);
        return (data);
    }

    /**
     * TODO: 读取压力值。
     */
    //% blockId=read_press block="read %module press %index data"
    //% weight=65
    export function readPressData(module: ModuleIndex, index: PressIndex): number{
        pins.i2cWriteRegister(PRESS_ADDRESS + module, 0x00, 0x01);
        let dataL;
        let dataH;
        let data;
        if (index == 0) {
            dataL = pins.i2cReadRegister(PRESS_ADDRESS + module, 0x01, NumberFormat.UInt8LE);
            dataH = pins.i2cReadRegister(PRESS_ADDRESS + module, 0x02, NumberFormat.UInt8LE);
            data = dataL+dataH*256;
        } else if (index == 1) {
            dataL = pins.i2cReadRegister(PRESS_ADDRESS + module, 0x03, NumberFormat.UInt8LE);
            dataH = pins.i2cReadRegister(PRESS_ADDRESS + module, 0x04, NumberFormat.UInt8LE);
            data = dataL+dataH*256;
        }
        return (data);
    }

    /**
     * TODO: 读取声音响度。
     */
    //% blockId=read_loudness block="read %module loudness data"
    //% weight=65
    export function readLoudnessData(module: ModuleIndex): number{
        pins.i2cWriteRegister(LOUDNESS_ADDRESS + module, 0x00, 0x01);
        let data = pins.i2cReadRegister(LOUDNESS_ADDRESS  + module , 0x01, NumberFormat.UInt8LE);
        return (data);
    }

    /**
     * TODO: 读取温湿度。
     */
    //% blockId=read_temp_humidity block="read %module  %measure data"
    //% weight=65

    export function readTempOrHumidity(module: ModuleIndex, measure: MesureContent): number{
        let buf = pins.createBuffer(6);
        let onboardTempValue = 400;
        let extendTempValue;
        let humidityValue;
        let address = TEMP_ADDRESS + module;
        if (!tempDevEnable[module]) {
            tempEnable(address, module);
            return 9999;
        } else { 
            pins.i2cWriteRegister(address, 0x00, 0x01);
            let res = pins.i2cReadBuffer(address, 6);//Buffer
            onboardTempValue = -450 + 1750 * (res[0] << 8 | res[1]) / 65535;
            humidityValue = 100 * (res[2] << 8 | res[3]) / 65535;
            extendTempValue = (res[5] << 8 | res[4]) * 10 / 16.0;
            if (measure == 0) {
                return onboardTempValue * 0.1;
            } else if (measure == 1) {
                return humidityValue;
            } else if (measure == 2) { 
                return extendTempValue * 0.1;
            }
            return 9999;
        }
    }

    /**
     * TODO: 读取电位器。
     */
    //% blockId=read_pm block="read %module pm data"
    //% weight=65

    export function readPmData(module: ModuleIndex): number{
        pins.i2cWriteRegister(PM_ADDRESS + module, 0x00, 0x01);
        let data = pins.i2cReadRegister(PM_ADDRESS  + module , 0x01, NumberFormat.UInt8LE);
        return (255 - data);
    }

    /**
     * TODO: 读取土壤湿度。
     */
    //% blockId=read_soil block="read %module soil data"
    //% weight=65
    export function readSoilData(module: ModuleIndex): number{ 
        pins.i2cWriteRegister(SOIL_ADDRESS + module, 0x00, 0x01);
        let data = pins.i2cReadRegister(SOIL_ADDRESS  + module , 0x01, NumberFormat.UInt8LE);
        return (data);
    }

    /**
     * TODO: 读取巡线值。
     */
    //% blockId=read_line block="read %module line data"
    //% weight=65
    export function readlineData(module: ModuleIndex): number{ 
        pins.i2cWriteRegister(LINE_ADDRESS + module, 0x00, 0x01);
        let data = pins.i2cReadRegister(LINE_ADDRESS  + module , 0x01, NumberFormat.UInt8LE);
        return (data);
    }

    /**
     * TODO: 读取颜色值。
     */
    //% blockId=read_color block="read %module color data"
    //% weight=65
    export function readColorData(module: ModuleIndex): number{ 
        pins.i2cWriteRegister(COLOR_ADDRESS + module, 0x00, 0x01);
        let data = pins.i2cReadRegister(COLOR_ADDRESS  + module , 0x01, NumberFormat.UInt8LE);
        return (data);
    }

}
