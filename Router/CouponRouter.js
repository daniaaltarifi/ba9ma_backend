const express = require('express');
const router= express.Router()
const CouponController = require('../Controller/CouponController');
router.get('/', CouponController.getCoupon);
router.get('/:id', CouponController.getCouponById);
router.get('/coupons/:coupon_code',CouponController.getCouponByCode);
router.post('/add', CouponController.addCoupon);
router.put('/update/:id', CouponController.updateCoupon);
router.delete('/delete/:id', CouponController.deleteCoupon);
router.delete('/deleteall', CouponController.deleteAllCoupons);
module.exports=router