const getUniqueErrorMessage = (err) => {
  let output;
  try {
    let fieldname = err.message.substring(
      err.message.lastIndexOf(".$") + 2,
      err.message.lastIndexOf("_1")
    );
    output =
      fieldname.charAt(0).toUpperCase() + fieldname.slice(1) + "Already exists";
  } catch (ex) {
    output = "Unique field aready exists";
  }
  return output;
};

const getErrorMessage = (err) => {
  let message = "";
  if (err.code) {
    switch (err.code) {
      case 1100:
      case 1101:
        message = getUniqueErrorMessage(err);
        break;
      default:
        message = "Something went wrong";
    }
  } else if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  } else if (err.message) {
    message = err.message;
  }
  return message;
};

export default { getErrorMessage };
