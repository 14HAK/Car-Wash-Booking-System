<!-- .........Custom validation function for MongoDB ObjectId............ -->
 const isValidObjectId = (value) => Types.ObjectId.isValid(value);




 <!-- routes -->
 user: /api/auth/signup