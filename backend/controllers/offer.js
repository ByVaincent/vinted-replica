const Offer = require("../models/Offer");
const User = require("../models/User");
const convertToBase64 = require("../functions/functions").convertToBase64;
const cloudinary = require("cloudinary").v2;

//The user token is in req.token frome the midelware isAuthorized

const publishOffer = async (req, res) => {
  try {
    //check the datas
    if (
      !req.body.title ||
      !req.body.price ||
      !req.body.description ||
      req.body.title.length > 50 ||
      req.body.price > 100000 ||
      req.body.description.length > 500
    ) {
      throw {
        status: 400,
        message: "Add a valid title, a valid price, and a valid description",
      };
    }

    const owner = await User.findOne({ token: req.token });

    const newOffer = new Offer({
      product_name: req.body.title,
      product_description: req.body.description,
      product_price: req.body.price,
      product_details: [
        { MARQUE: req.body.brand },
        { TAILLE: req.body.size },
        { ÉTAT: req.body.condition },
        { COULEUR: req.body.color },
        { EMPLACEMENT: req.body.city },
      ],
      owner: owner._id,
    });

    //upload the picture to cloudinary
    const uploadedPicture = await cloudinary.uploader.upload(
      convertToBase64(req.files.picture),
      {
        asset_folder: `/vinted/offers/${newOffer._id}`,
      }
    );

    //add the datas from cloudinary to the newOffer

    newOffer.product_image = {
      secure_url: uploadedPicture.secure_url,
      public_id: uploadedPicture.public_id,
    };

    await newOffer.save();

    res.json(newOffer);
  } catch (error) {
    res
      .status(error.status || 500)
      .json(error.message || "Internal server error");
  }
};

const updateOffer = async (req, res) => {
  try {
    //check the datas
    if (req.body.title && req.body.title.length > 50) {
      throw {
        status: 400,
        message: "Add a valid title, a valid price, and a valid description",
      };
    }

    if (req.body.description && req.body.description.length > 500) {
      throw {
        status: 400,
        message: "Add a valid title, a valid price, and a valid description",
      };
    }

    if (req.body.price && req.body.price > 100000) {
      throw {
        status: 400,
        message: "Add a valid title, a valid price, and a valid description",
      };
    }

    //find the offer to update
    const offerToUpdate = await Offer.findById(req.params.id).catch((error) => {
      throw { status: 400, message: "Invalid Id" };
    });

    if (!offerToUpdate) {
      throw { status: 400, message: "No offer found" };
    }
    console.log(offerToUpdate);

    //check de keys to update
    for (key in req.body) {
      console.log(key);

      switch (key) {
        case "title":
          offerToUpdate.product_name = req.body[key];
          break;
        case "description":
          offerToUpdate.product_description = req.body[key];
          break;
        case "price":
          offerToUpdate.product_price = req.body[key];
          break;
        case "condition":
          offerToUpdate.product_details[2].ÉTAT = req.body[key];
          break;
        case "city":
          offerToUpdate.product_details[4].EMPLACEMENT = req.body[key];
          break;
        case "brand":
          offerToUpdate.product_details[0].MARQUE = req.body[key];
          break;
        case "size":
          offerToUpdate.product_details[1].TAILLE = req.body[key];
          break;
        case "color":
          offerToUpdate.product_details[3].COULEUR = req.body[key];
          break;
        default:
          throw { status: 400, message: `${req.body[key]} doesn't exist` };
      }
    }

    offerToUpdate.markModified("product_details");

    await offerToUpdate.save();

    res.json("Product updated");
  } catch (error) {
    res
      .status(error.status || 500)
      .json(error.message || "Internal server error");
  }
};

const deleteOffer = async (req, res) => {
  try {
    if (!req.params.id) {
      throw { status: 400, message: "no id!" };
    }

    const offerToDelete = await Offer.findById(req.params.id)
      .populate("owner")
      .catch((error) => {
        throw { status: 400, message: "Id not found" };
      });

    //check the owner of the delete action
    if (offerToDelete.owner.token !== req.token) {
      throw { status: 401, message: "Unauthorized" };
    }

    await Offer.deleteOne({ _id: offerToDelete._id });

    //delete the images
    const deletePicture = await cloudinary.uploader.destroy(
      offerToDelete.product_image.public_id
    );

    const deleteFolder = await cloudinary.api.delete_folder(
      `/vinted/offers/${offerToDelete._id}`
    );

    res.json("Offer deleted");
  } catch (error) {
    res
      .status(error.status || 500)
      .json(error.message || "Internal server error");
  }
};

module.exports = { publishOffer, updateOffer, deleteOffer };
