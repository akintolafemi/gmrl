export default function PrettyPhone(str) {
  let pretty = "";
  try {
    let num = str.trim();
    let firstChar = num.charAt(0);
    if (num.length === 11 && firstChar === "0") {
      pretty = "234" + num.substr(1, num.length - 1);
    }
    else if (num.length === 13 && firstChar === "2") {
      pretty = num;
    }
    else if (num.length === 14 && firstChar === "+") {
      pretty = num.substr(1, num.length - 1);
    }
    else if (num.length === 10 && firstChar !== "0") {
      pretty = "234" + num;
    }
    else {
      pretty = num;
    }
 	  return pretty
  } catch (error) {
    console.log(error.message);
  }
  return
}
