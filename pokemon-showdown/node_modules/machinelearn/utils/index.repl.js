"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
var tensors_1 = require("./tensors");
var validation_1 = require("./validation");
var result = tensors_1.inferShape([[1, 2]]);
console.log(result);
console.log(validation_1.validateMatrixType([['z', 'z']], ['string']));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgucmVwbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbHMvaW5kZXgucmVwbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9CQUFvQjtBQUNwQixxQ0FBdUM7QUFDdkMsMkNBQWtEO0FBRWxELElBQU0sTUFBTSxHQUFHLG9CQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVwQixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUFrQixDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyJ9