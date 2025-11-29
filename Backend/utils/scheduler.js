// const cron = require('node-cron');
// const Sleep = require('../models/Sleep');
// const Notification = require('../models/Notification');
// const moment = require('moment');

// // Run every minute (can be adjusted as needed)
// cron.schedule('* * * * *', async () => {
//   const now = moment();
//   const currentTime = now.format('HH:mm');
//   const today = now.startOf('day').toDate();

//   try {
//     const sleepEntries = await Sleep.find({ date: today });

//     for (const entry of sleepEntries) {
//       const userId = entry.userId;
      
//       // Notify wake time
//       if (entry.wakeTime === currentTime) {
//         await Notification.create({
//           userId,
//           title: 'Wake-up Reminder',
//           message: `Good Morning! It's time to wake up 🌞`
//         });
//       }

//       // Notify sleep time
//       if (entry.sleepTime === currentTime) {
//         await Notification.create({
//           userId,
//           title: 'Sleep Reminder',
//           message: `Time to sleep 😴. Maintain a healthy schedule!`
//         });
//       }
//     }

//     console.log(`[SLEEP NOTIFICATION] Checked for ${currentTime}`);
//   } catch (err) {
//     console.error('[SLEEP NOTIFICATION ERROR]', err.message);
//   }
// });

//added menstruation notification

// const cron = require('node-cron');
// const Sleep = require('../models/Sleep');
// const Medication = require('../models/Medication');
// const Notification = require('../models/Notification');
// const moment = require('moment');

// // Runs every minute ⏰
// cron.schedule('* * * * *', async () => {
//   const now = moment();
//   const currentTime = now.format('HH:mm');
//   const todayDateStr = now.format('YYYY-MM-DD');
//   const today = now.startOf('day').toDate();

//   console.log(`[CRON] Checking notifications for ${currentTime}`);

//   try {
//     // === 1. Sleep Notifications === //
//     const sleepEntries = await Sleep.find({ date: today });

//     for (const entry of sleepEntries) {
//       const userId = entry.userId;

//       if (entry.wakeTime === currentTime) {
//         await Notification.create({
//           userId,
//           title: 'Wake-up Reminder',
//           message: `Good Morning! It's time to wake up 🌞`,
//         });
//       }

//       if (entry.sleepTime === currentTime) {
//         await Notification.create({
//           userId,
//           title: 'Sleep Reminder',
//           message: `Time to sleep 😴. Maintain a healthy schedule!`,
//         });
//       }
//     }

//     // === 2. Medication Notifications === //
//     const medicationEntries = await Medication.find();

//     for (const med of medicationEntries) {
//       const userId = med.userId;

//       for (const time of med.times) {
//         const alreadyTaken = med.takenLog?.some(
//           (log) => log.date === todayDateStr && log.time === time
//         );

//         if (time === currentTime && !alreadyTaken) {
//           await Notification.create({
//             userId,
//             title: `Medication Reminder 💊`,
//             message: `Time to take your ${med.tabletName} tablet at ${time}`,
//           });
//         }
//       }
//     }

//   } catch (err) {
//     console.error('[CRON ERROR]', err.message);
//   }
// });

//added menstruation notification and sleep notification and medication notification and menstruation notification


const cron = require('node-cron');
const moment = require('moment');
const Sleep = require('../models/Sleep');
const Medication = require('../models/Medication');
const Notification = require('../models/Notification');
const Menstruation = require('../models/Menstruation');

// Run every minute
cron.schedule('* * * * *', async () => {
  const now = moment();
  const currentTime = now.format('HH:mm');
  const todayDateStr = now.format('YYYY-MM-DD');
  const today = now.startOf('day').toDate();

  console.log(`[CRON] Checking notifications for ${currentTime}`);

  try {
    // === 1. Sleep Notifications === //
    const sleepEntries = await Sleep.find({ date: today });

    for (const entry of sleepEntries) {
      const userId = entry.userId;

      if (entry.wakeTime === currentTime) {
        await Notification.create({
          userId,
          title: 'Wake-up Reminder',
          message: `Good Morning! It's time to wake up 🌞`,
        });
      }

      if (entry.sleepTime === currentTime) {
        await Notification.create({
          userId,
          title: 'Sleep Reminder',
          message: `Time to sleep 😴. Maintain a healthy schedule!`,
        });
      }
    }

    // === 2. Medication Notifications === //
    const medicationEntries = await Medication.find();

    for (const med of medicationEntries) {
      const userId = med.userId;

      for (const time of med.times) {
        const alreadyTaken = med.takenLog?.some(
          (log) => log.date === todayDateStr && log.time === time
        );

        if (time === currentTime && !alreadyTaken) {
          await Notification.create({
            userId,
            title: `Medication Reminder 💊`,
            message: `Time to take your ${med.tabletName} tablet at ${time}`,
          });
        }
      }
    }

    // === 3. Menstruation Notifications === //
    if (currentTime === '01:45') {
      const entries = await Menstruation.find();

      for (const entry of entries) {
        const userId = entry.userId;
        const lastDate = moment(entry.lastPeriodDate).startOf('day');
        const nextDate = lastDate.clone().add(30, 'days'); // Assuming 30-day cycle
        const daysBefore = nextDate.clone().subtract(5, 'days');

        if (
          now.isSameOrAfter(daysBefore) &&
          now.isBefore(nextDate)
        ) {
          // 5 days before
          await Notification.create({
            userId,
            title: 'Menstruation Reminder 🩸',
            message: `Your periods are on the way. Take care and track your cycle 💕`,
          });
        } else if (now.isSame(nextDate, 'day')) {
          // On expected day
          await Notification.create({
            userId,
            title: 'Period Day 🩸',
            message: `Take rest. Is your period started today?`,
          });
        } else if (now.isAfter(nextDate, 'day')) {
          // If user hasn't updated and date is past, remind again
          await Notification.create({
            userId,
            title: 'Update Your Period Date',
            message: `Is your period started? Please update your last period date to track accurately.`,
          });
        }
      }
    }

  } catch (err) {
    console.error('[CRON ERROR]', err.message);
  }
});
