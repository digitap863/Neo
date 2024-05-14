module.exports={
    verifyAdminLoggedIn:(req, res, next) => {
      console.log(req.session.login);
      if (req.session.login) {
        res.redirect('/admin/completed-projects')
        } else {
          next()
        }
      },
      verifyAdminLoggedOut:(req, res, next) => {
        console.log(req.session.login);
        if (req.session.login) {
          next()
        } else {
          res.redirect('/admin')
        }
      }
}