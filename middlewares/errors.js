module.exports = app => {
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
    // res.status(500).send('Internal server error!!!');
  });
};

// module.exports = (err, req, res, next) =>
//   res.status(500).send('Internal server error!!!');
