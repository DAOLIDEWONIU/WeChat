var gulp = require("gulp"),
    htmlmin = require('gulp-htmlmin'),//html压缩
    minifycss = require("gulp-minify-css"),//css压缩
    pngcrush = require('imagemin-pngcrush'),
    imagemin = require('gulp-imagemin'),//图片压缩
    notify = require('gulp-notify'),//提示信息
    uglify = require("gulp-uglify"),//js压缩
    jshint = require('gulp-jshint');//js检测

var parseString = require('xml2js').parseString;
//压缩html
gulp.task('html',function(){
    var options = {
        collapseWhitespace:true,//清除空格，压缩html
        collapseBooleanAttributes:true,//省略布尔属性的值
        removeComments:true,//清除html中注释的部分
        removeEmptyAttributes:true,//清除所有的空属性
        removeScriptTypeAttributes:true,//清除所有script标签中的type="text/javascript"属性
        removeStyleLinkTypeAttributes:true,//清楚所有Link标签上的type属性
        minifyJS:true,//压缩html中的javascript代码
        minifyCSS:true//压缩html中的css代码
    };
    gulp.src('./src/html/**/*')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/html'))
        .pipe(notify({ message: 'html task ok' }));
});
// 压缩图片
gulp.task('img', function() {
    return gulp.src('./src/imgs/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('./dist/imgs'))
        .pipe(notify({ message: 'img task ok' }));
});
// 检查js
gulp.task('lint', function() {
    return gulp.src('./src/js/**.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(notify({ message: 'lint task ok' }));
});
// 合并、压缩js文件
gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist/js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify({ message: 'js task ok' }));
});
//css任务
gulp.task("css", function() {
    gulp.src(__dirname + "/src/css/**/*.css")
        // .pipe(sass())//编译sass
        .pipe(minifycss())//压缩css
        // .pipe(rev())
        .pipe(gulp.dest(__dirname +"/dist/css"))
        .pipe(notify({ message: 'css task ok' }));
});
//默认任务
gulp.task("default", ["css","html","img","lint","js"], function() {
    //监听sass变化
    gulp.watch(__dirname +"/src/css/**/*.css", ["css"]);
    //监听lint\js变化
    gulp.watch('./src/js/**.js', ['lint','js']);
    //监听html变化
    gulp.watch("./src/html/**/*", ["html"]);
    //监听imgs变化
    gulp.watch('src/imgs/*', ['img']);
});