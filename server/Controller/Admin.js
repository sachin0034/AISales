const adminModel = require("../Model/Admin");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");
const moment = require("moment");
const { sendErrorEmail } = require("../utils/Errormail");
const uuid = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

exports.AdminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "enter a valid email",
      });
    }
    const admin = await adminModel.findOne({ email: email });

    if (!admin) {
      return res.status(401).json({
        error: "wrong email or password",
      });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({
        error: "wrong email or password",
      });
    }

    const token = jwt.sign(
      { userId: admin._id, email: admin.email },
      process.env.ADMINJWTSECRET
    );

    res.status(200).json({
      email: admin.email,
      token: token,
    });
  } catch (error) {
    sendErrorEmail(email, "Someone tried to Login to Admin Panel");
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.GetAllVoices = async (req, res, next) => {
  //send all available voices to frontend in the below format
  res.status(200).json({
    voices: [
      {
        voice_id: 2,
        name: "jen-english",
        is_custom: false,
        reduce_latency: true,
      },
      {
        voice_id: 0,
        name: "matt",
        is_custom: false,
        reduce_latency: true,
      },
    ],
  });
};
exports.SingleCall = async (req, res, next) => {
  console.log(req.body)
  //single call here
}