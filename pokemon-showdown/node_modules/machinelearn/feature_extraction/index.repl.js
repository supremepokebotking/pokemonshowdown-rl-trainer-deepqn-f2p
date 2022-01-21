"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
var text_1 = require("./text");
var cv = new text_1.CountVectorizer();
var text1 = ['deep learning ian good fellow learning jason shin shin', 'yoshua bengio'];
var vocabCounts = cv.fit_transform(text1);
console.log(vocabCounts);
console.log(cv.vocabulary);
console.log(cv.getFeatureNames());
var newVocabCounts = cv.transform(['ian good fellow jason duuog']);
console.log(newVocabCounts);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgucmVwbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZmVhdHVyZV9leHRyYWN0aW9uL2luZGV4LnJlcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQkFBb0I7QUFDcEIsK0JBQXlDO0FBRXpDLElBQU0sRUFBRSxHQUFHLElBQUksc0JBQWUsRUFBRSxDQUFDO0FBRWpDLElBQU0sS0FBSyxHQUFHLENBQUMsd0RBQXdELEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDMUYsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7QUFFbEMsSUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztBQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDIn0=