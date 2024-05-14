module.exports = {
  getHome: (req, res) => {
    try {
      res.render("user/home");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getAbout: (req, res) => {
    try {
      res.render("user/about");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getShop: (req, res) => {
    try {
      res.render("user/shop");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getContact: (req, res) => {
    try {
      res.render("user/contact");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getBlog: (req, res) => {
    try {
      res.render("user/blogs");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCategories:(req,res)=>{
    try {
      res.render("user/categories");
    } catch (err) {
      res.render("error", { message: err });
    }
  }
};
