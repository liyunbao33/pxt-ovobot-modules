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
    const PM_ADDRESS = 0x60
    const SOIL_ADDRESS = 0x48
    const LINE_ADDRESS = 0x51
    const COLOR_ADDRESS = 0x40
    const RGB_ADDRESS = 0x3C
    const HOARE_ADDRESS = 0x44
    const LOUDNESS_ADDRESS = 0x38
    const KEY_ADDRESS = 0x30
    const lowBright = 8
    const selectColors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0x800080, 0xffffff, 0x000000]
    let tempDevEnable = [false,false,false,false]
    function sonicEnable() {
        pins.i2cWriteRegister(SONAR_ADDRESS, 0x00, 0x01);
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
        let buf = pins.createBuffer(14);
        let startPos;

        buf[0] = 0;
        buf[1] = 1;
        if (index == 0) {
            for (let i = 2; i < 12; i += 3) {
                buf[i] = ((selectColors[color] >> 8) & 0xff) / lowBright;
                buf[i + 1] = ((selectColors[color] >> 16) & 0xff) / lowBright;
                buf[i + 2] = (selectColors[color] & 0xff) / lowBright;
            }
        } else { 
            startPos = 2 + 3 * (index-1);
            buf[startPos] = ((selectColors[color] >> 8) & 0xff) / lowBright;
            buf[startPos + 1] = ((selectColors[color] >> 16) & 0xff) / lowBright;
            buf[startPos + 2] = (selectColors[color] & 0xff) / lowBright;
        }
        pins.i2cWriteBuffer(RGB_ADDRESS, buf);
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
            data = pins.i2cReadRegister(RGB_TOUCHKEY_ADDRESS + module, 0x13, NumberFormat.UInt8LE);
        } else {
            data = pins.i2cReadRegister(RGB_TOUCHKEY_ADDRESS + module, 0x14, NumberFormat.UInt8LE);
        }
        return (data);
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
     * TODO: 读取压力值。
     */
    //% blockId=read_press block="read %module press data"
    //% weight=65
    export function readPressData(module: ModuleIndex): number{
        pins.i2cWriteRegister(HOARE_ADDRESS + module, 0x00, 0x01);
        let dataL = pins.i2cReadRegister(HOARE_ADDRESS + module, 0x01, NumberFormat.UInt8LE);
        let dataH = pins.i2cReadRegister(HOARE_ADDRESS + module, 0x02, NumberFormat.UInt8LE);
        let data = dataL+dataH*256;
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
