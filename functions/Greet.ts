export default function Greet(name) {
  let greet = "";
  try {
    var myDate = new Date();
    var hrs = myDate.getHours();

    if (hrs < 3)
      greet = 'You should be in bed ' + name;
    else if (hrs >= 3 && hrs <= 6)
      greet = "Hi " + name + "! it's dawn";
    else if (hrs > 6 && hrs < 12)
      greet = "Good morning " + name;
    else if (hrs >= 12 && hrs <= 17)
      greet = "Good afternoon " + name;
    else if (hrs > 17 && hrs <= 21)
      greet = "Good night " + name;
    else if (hrs > 21)
      greet = "It's bed time! Sleep tight.";

 	  return greet
  } catch (error) {
    console.log(error.message);
  }
  return
}
