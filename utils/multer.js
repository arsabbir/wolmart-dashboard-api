import multer from "multer";
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.fieldname);
  },
  // destination: (req, file, cb) => {
  //   if (file.fieldname == "brand-photo") {
  //     cb(null, "public/photo/brand/");
  //   }

  //   if (file.fieldname == "category-photo") {
  //     cb(null, "public/photo/category/");
  //   }
  // },
});


export const CategoryMulter = multer({ storage }).single("category-photo");
export const BrandMulter = multer({ storage }).single("brand-photo");
