const { check, validationResult, body } = require("express-validator");

const AppError = require("./appError");
const { errorMessages } = require("./messages");
const { aggreFilters } = require("./filterJson");

const sendErrorResponse = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 400,
      message: errors.errors.map((el) => el.msg)[0],
    });
  }

  next();
};

exports.validateUserSignup = [
  body("email")
    .not()
    .isEmpty()
    .withMessage(errorMessages.email.empty)
    .isEmail()
    .withMessage(errorMessages.email.invalid),
  body("contact")
    .trim()
    .not()
    .isEmpty()
    .withMessage(errorMessages.contact.empty)
    .isNumeric()
    .withMessage(errorMessages.contact.notContact)
    .isLength({ min: 7, max: 15 })
    .withMessage(errorMessages.contact.invalid),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage(errorMessages.password.empty)
    .isLength({ min: 8, max: 15 })
    .withMessage(errorMessages.password.invalid)
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    )
    .withMessage(errorMessages.password.invalid),
  body("name").not().isEmpty().withMessage(errorMessages.name.empty),
  (req, res, next) => {
    sendErrorResponse(req, res, next);
  },
];

exports.validateUserSignin = [
  body("email")
    .not()
    .isEmpty()
    .withMessage(errorMessages.email.empty)
    .isEmail()
    .withMessage(errorMessages.email.invalid),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage(errorMessages.password.empty)
    .isLength({ min: 8, max: 15 })
    .withMessage(errorMessages.password.invalid)
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    )
    .withMessage(errorMessages.password.invalid),
  (req, res, next) => {
    sendErrorResponse(req, res, next);
  },
];

exports.validateNewConfirmPassword = [
  body("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage(errorMessages.password.empty)
    .isLength({ min: 8, max: 15 })
    .withMessage(errorMessages.password.invalid)
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    )
    .withMessage(errorMessages.password.invalid),
  body("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage(errorMessages.password.empty)
    .custom(async (confirmPassword, { req }) => {
      const { newPassword } = req.body;

      if (newPassword !== confirmPassword) {
        throw new Error(errorMessages.password.newAndConfirmSame);
      }
    }),
  (req, res, next) => {
    sendErrorResponse(req, res, next);
  },
];

exports.validateCategory = [
  body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage(errorMessages.category.invalidTitle)
    .isLength({ min: 3, max: 30 })
    .withMessage(errorMessages.category.invalidTitleLength),
  body("postType")
    .trim()
    .not()
    .isEmpty()
    .isIn(aggreFilters.category.postTypes)
    .withMessage(errorMessages.category.invalidPostType),
  (req, res, next) => {
    sendErrorResponse(req, res, next);
  },
];

exports.validateContactUS = [
  body("name").not().isEmpty().withMessage(errorMessages.name.empty),
  body("email")
    .not()
    .isEmpty()
    .withMessage(errorMessages.email.empty)
    .isEmail()
    .withMessage(errorMessages.email.invalid),
  body("postType")
    .trim()
    .not()
    .isEmpty()
    .isIn(aggreFilters.category.postTypes)
    .withMessage(errorMessages.category.invalidPostType),
  body("topic").not().isEmpty().withMessage(errorMessages.topic.empty),
  body("message")
    .not()
    .isEmpty()
    .withMessage(errorMessages.contactMessage.empty),
     (req, res, next) => {
    sendErrorResponse(req, res, next);
  },
];
