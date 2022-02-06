"use strict";
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
var Iris_1 = require("./Iris");
var irisData = new Iris_1.Iris();
irisData.load().then(function (data) {
    var description = data.description;
    console.log('checking desc', description);
});
var Boston_1 = require("./Boston");
var bostonData = new Boston_1.Boston();
bostonData.load().then(function (data) {
    console.log(data);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgucmVwbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGF0YXNldHMvaW5kZXgucmVwbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0JBQW9COztBQUVwQiwrQkFBOEI7QUFFOUIsSUFBTSxRQUFRLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztBQUM1QixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSTtJQUNoQixJQUFBLDhCQUFXLENBQVU7SUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDLENBQUM7QUFFSCxtQ0FBa0M7QUFFbEMsSUFBTSxVQUFVLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztBQUNoQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSTtJQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxDQUFDIn0=