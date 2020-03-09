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

//% color=190 weight=100 icon="\uf1ec" block="Ovobot Modules"
namespace ovobotModules {
    const SONAR_ADDRESS = 0x52
    const MOTOR_ADDRESS = 0x64

    function sonicEnable() {
        pins.i2cWriteRegister(SONAR_ADDRESS, 0x00, 0x01);
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
    //% blockId=control_motor_output block="control motor %module output %speed"
    //% weight=65
    export function controlMotorOutput(module: ModuleIndex, speed: number) {
        let buf = pins.createBuffer(8);
        buf[0] = 0x00;
        buf[1] = speed > 0 ? 0 : 1;
        buf[2] = Math.abs(speed)

        pins.i2cWriteBuffer(MOTOR_ADDRESS + module, buf);
    }
}