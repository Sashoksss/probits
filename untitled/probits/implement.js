"use strict";



/*result-button function*/
document.getElementById("outputProbit").onclick = function() {


	/*get number of groups*/
	let groupNumber = Number(document.getElementById("groupNumber").value);

	/**
	 * Gets the value of inputDose, numberInGroup, effectInGroup
	 * @param {number} groupNumber
	 * @return {number} value of inputDose, numberInGroup, effectInGroup
	 */

	function Group(groupNumber) {

		this.inputDose = Number(document.getElementById("inputDose" + groupNumber).value);
		if (this.inputDose <= 0) {
			alert ("Введите корректные данные в поле [Доза]!");
		}

		this.numberInGroup = Number(document.getElementById("inputNumberInGroup" + groupNumber).value);
		if ((this.numberInGroup < 3) || (this.numberInGroup > 15)) {
			alert ("Введите корректные данные в поле [Количество животных в группе]!");
		}

		this.effectInGroup = Number(document.getElementById("inputEffectInGroup" + groupNumber).value);
		// if (this.effectInGroup < 0) {
		// 	alert ("Введите корректные данные в поле [Эффект]!");
		// }
	}



	/*  Gets the value of probit and weight of probit*/
	Group.prototype.probitAndWeight = function() {
		/*get the probit*/
		this.probit = (probitArray[this.numberInGroup - 3][this.effectInGroup]);

		/*get the probit weight*/
		this.interm = (Math.round(this.probit * 10) / 10);
		for (let count = 0; count < probitWeightArray.length; count++)
			if (this.interm == probitWeightArray[count]) {
				this.probitWeight = probitWeightArray[count + 1];
			}
	};

	/*get the calculations in obj*/
	Group.prototype.calcInOneObj = function() {
		this.calcMulti3 = this.inputDose * this.probit * this.probitWeight;
		this.calcMulti4 = this.inputDose * this.probitWeight;
		this.calcMulti5 = this.probit * this.probitWeight;
		this.calcMulti6 = (Math.pow(this.inputDose, 2)) * this.probitWeight;
	};

	/**
	 * One group is one object. The function below creates
	 * objects for each group, calculate necessary values per object,
	 * makes summ of suitable values between the objects and return the LD50
	 */
	function lethalDose50Result() {
		let arrObj = [];    /*array for objects*/

		/*summable values in one obj*/
		let summ2 = 0,
			summ3 = 0,
			summ4 = 0,
			summ5 = 0,
			summ6 = 0,

			/*value for LD50 error calculate*/
			summAnimInExp = 0;

		/*creating objects*/
		for (let i = 0; i < groupNumber; i++) {
			arrObj[i] = new Group(i + 1);

			if (arrObj[i].effectInGroup > arrObj[i].numberInGroup) {
				alert ("Эффект в группе не может быть больше чем животных в группе");
				return;
			}

			/*MAKE FUNCTION WHICH GET THIS ARRAY AND COMPUTE WITH IT !!!!!!!!!!!!!!!!!!!!!!!1*/
			summAnimInExp += arrObj[i].numberInGroup;

			arrObj[i].probitAndWeight();
			arrObj[i].calcInOneObj();

			summ2 += arrObj[i].probitWeight;
			summ3 += arrObj[i].calcMulti3;
			summ4 += arrObj[i].calcMulti4;
			summ5 += arrObj[i].calcMulti5;
			summ6 += arrObj[i].calcMulti6;

		}

		/*subtraction the 0% and 100% probit*/
		summAnimInExp = summAnimInExp - arrObj[0].numberInGroup - arrObj[groupNumber - 1].numberInGroup;

		/*parameter 1*/
		let b1 = ((summ3 * summ2) - (summ4 * summ5)) / ((summ2 * summ6) - (summ4 * summ4));

		/*parameter 2*/
		let b0 = (summ5 - (b1 * summ4)) / (summ2);

		/*calculating doses*/ /*MAKE WITH FUNCTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
		let ld50 = (5 - b0) / b1;
		ld50 = Math.round(ld50 * 100) / 100;

		let ld16 = (4 - b0) / b1;
		ld16 = Math.round(ld16 * 100) / 100;

		let ld84 = (6 - b0) / b1;
		ld84 = Math.round(ld84 * 100) / 100;

		/*error of LD50*/
		let errorLD50 =  (ld84 - ld16) / Math.sqrt(2 * summAnimInExp);
		errorLD50 = Math.round(errorLD50 * 100) / 100;

		document.getElementById("ld50").innerHTML = ld50 + "±" + errorLD50;
		document.getElementById("ld16").innerHTML = ld16;
		document.getElementById("ld84").innerHTML = ld84;
	}

	lethalDose50Result();

};