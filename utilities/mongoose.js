import fs from 'fs';
import { __dirname } from './index.js';
import User from '../models/User.js';
import Region from '../models/Region.js';
import Member from '../models/Member.js';
import Event from '../models/Event.js';
import Attendance_Book from '../models/Attendance_Book.js';

export const formatterErrorValidation = (error) => {
  const errors = {};
  const detailErrors = error.errors;

  for (const property in detailErrors) {
    errors[property] = detailErrors[property].message;
  }

  return errors;
};

export const backupDatabase = async () => {
  const users = await User.find().exec();
  const regions = await Region.find().exec();
  const members = await Member.find().exec();
  const events = await Event.find().exec();
  const attendance_books = await Attendance_Book.find().exec();

  const newUsers = [];
  const newRegions = [];
  const newMembers = [];
  const newEvents = [];
  const newAttendanceBooks = [];

  for (const user of users) {
    newUsers.push(user);
  }
  for (const region of regions) {
    newRegions.push(region);
  }
  for (const member of members) {
    newMembers.push(member);
  }
  for (const event of events) {
    newEvents.push(event);
  }
  for (const attendance of attendance_books) {
    newAttendanceBooks.push(attendance);
  }

  const backup = {
    users: newUsers,
    regions: newRegions,
    members: newMembers,
    events: newEvents,
    attendance_books: newAttendanceBooks,
  };

  fs.writeFileSync(`${__dirname}/backup.json`, JSON.stringify(backup));
};

export const restoreDatabase = async () => {
  const rawdata = fs.readFileSync(`${__dirname}/backup.json`);
  const database = JSON.parse(rawdata);

  for (const user of database.users) {
    const doc = new User(user);
    await doc.save({ validateBeforeSave: false });
  }
  for (const region of database.regions) {
    const doc = new Region(region);
    await doc.save({ validateBeforeSave: false });
  }
  for (const member of database.members) {
    const doc = new Member(member);
    await doc.save({ validateBeforeSave: false });
  }
  for (const event of database.events) {
    const doc = new Event(event);
    await doc.save({ validateBeforeSave: false });
  }
  for (const attendance of database.attendance_books) {
    const doc = new Attendance_Book(attendance);
    await doc.save({ validateBeforeSave: false });
  }
};
