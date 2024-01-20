// // coordinate.validator.ts
// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidationArguments,
// } from "class-validator";

// export function IsCoordinate(validationOptions?: ValidationOptions) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       name: "isCoordinate",
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//           if (!value || !Array.isArray(value) || value.length !== 2) {
//             return false;
//           }

//           const [latitude, longitude] = value;
//           return (
//             typeof latitude === "number" &&
//             isFinite(latitude) &&
//             typeof longitude === "number" &&
//             isFinite(longitude)
//           );
//         },
//       },
//     });
//   };
// }
