const Joi = require('joi');

module.exports = Joi;

// 在导入的包中，@escook/express-joi 、@hapi/joi 、joi 是类似的。这里引发了我的思考。

// @escook/express-joi 中的依赖包含 joi ，该joi的版本是 "17.4.0" 。

// @hapi/joi 中包含joi文件夹，该 joi 的版本是 "17.1.0" 。

// joi包版本是 "17.8.3" 。

// 这里结合报错的信息“无法混合不同版本的 joi 模式”，我认为原因是：由于joi的迭代更新，导致几个包的joi版本不相同，所以会报错。