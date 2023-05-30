import { Schema, model } from 'mongoose';
import 'dotenv/config';
import './config/database.js';
import User from './models/User.js';
import Region from './models/Region.js';
import Member from './models/Member.js';
import Event from './models/Event.js';
const PresentBookSchema = new Schema({});
const PresentBook = model('PresentBook', PresentBookSchema);

// simpan semua data
const users = await User.find();
const regions = await Region.find();
const members = await Member.find();

// drop semua collection
await User.collection.drop();
await Region.collection.drop();
await Member.collection.drop();
await Event.collection.drop();
await PresentBook.collection.drop();

// masukkan ulang semua data

// users
for (const user of users) {
  const newUser = new User({
    ...user._doc,
    __v: 2,
  });
  await newUser.save({ validateBeforeSave: false });
}

// regions
for (const region of regions) {
  const newRegion = new Region({
    ...region._doc,
    __v: 2,
  });
  await newRegion.save({ validateBeforeSave: false });
}

// members
for (const member of members) {
  const newMember = new Member({
    _id: member._id,
    no_induk: member.no_induk,
    full_name: member.full_name,
    parent_name: member.parent_name,
    birth: member.birth,
    region: member.region,
    address: member.address,
    status: 1,
    image: member.image,
    __v: 2,
  });
  await newMember.save({ validateBeforeSave: false });
}

console.log('Berhasil');
