'use strict';

const SubDevice = require('./subdevice');
const { Sensor, SmokeDetection, Density } = require('abstract-things/sensors');
const BatteryLevel = require('../capabilities/battery-level');
const Voltage = require('./voltage');

console.log(SmokeDetection);
console.log(Density);

module.exports = class SmokeDetector extends SubDevice.with(SmokeDetection, BatteryLevel, Voltage, Density) {

        constructor(parent, info) {
                super(parent, info);

		this.miioModel = 'lumi.smoke';

		this.defineProperty('density');
		this.defineProperty('alarm', {
			name: 'smokeDetected'
		});

		this.defineProperty('battery', {
			name: 'batteryLevel'
		});
		this.updateDensity(0);

        }

	propertyUpdated(key, value, oldValue) {
		super.propertyUpdated(key, value, oldValue);
	}

	_report(data) {
		super._report(data);
		// Protect against reports without status
//		if(typeof data['alarm'] === 'undefined') return;
//		console.log("Report >> ....");

		if(data['alarm']){
			if(data['alarm'] == '1' || data['alarm'] == '2'){
                       	 	this.updateSmokeDetected(true, '1m');
                        	data['alarm'] == "detected";
               	 	}else{
				this.updateSmokeDetected(false);
                	        data['alarm'] === 'clear';
                	}
		}else if(data['density']){
			this.updateDensity(data['density']);
		}

	}

}
