/**
 * Provides access to basic micro:bit functionality.
 */
//% color=190 weight=100 icon="\uf1ec" block="Ovobot Modules"
namespace ovobotModules {
    const SONAR_ADDRESS = 0x52

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
}