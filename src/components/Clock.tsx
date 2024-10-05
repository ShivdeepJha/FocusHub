import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  period: string;
  startTime: string;
  endTime: string;
  task: string;
  description: string[];
}

interface TaskSchedule {
  tasks: Task[];
}

// Task schedule with time in "xx:xx" format
const taskSchedule = {
    tasks: [
      {
        period: "planning",
        startTime: "08:30",
        endTime: "09:00",
        task: "Plan your day and assign tasks to your juniors.",
        description: [
          "Review ongoing tasks.",
          "Set priorities for the day.",
          "Prepare to assign tasks to junior colleagues."
        ]
      },
      {
        period: "taskAssigning",
        startTime: "09:00",
        endTime: "10:00",
        task: "Assign tasks to junior colleagues and the UI/UX designer.",
        description: [
          "Assign coding tasks to junior developers.",
          "Assign UI/UX tasks to the designer.",
          "Clarify any questions from the team."
        ]
      },
      {
        period: "deepFocusCodingMorning",
        startTime: "10:00",
        endTime: "11:30",
        task: "Deep focus coding: Work on critical tasks while you are most active.",
        description: [
          "Work on high-priority features.",
          "Implement critical code changes.",
          "Minimize distractions for effective focus."
        ]
      },
      {
        period: "issueResolution",
        startTime: "11:30",
        endTime: "12:00",
        task: "Resolve issues for juniors and provide guidance.",
        description: [
          "Check in with juniors.",
          "Assist with any coding or design issues.",
          "Provide constructive feedback."
        ]
      },
      {
        period: "lunchBreak",
        startTime: "12:00",
        endTime: "12:45",
        task: "Lunch break: Recharge for the second half of the day.",
        description: [
          "Enjoy a healthy meal.",
          "Take a mental break from work.",
          "Prepare for afternoon tasks."
        ]
      },
      {
        period: "lightTasks",
        startTime: "12:45",
        endTime: "13:15",
        task: "Perform light tasks or documentation.",
        description: [
          "Review project documentation.",
          "Update task progress.",
          "Handle low-priority items."
        ]
      },
      {
        period: "collaborationAndDiscussions",
        startTime: "13:15",
        endTime: "15:00",
        task: "Collaboration and discussions with seniors regarding requirements.",
        description: [
          "Discuss project requirements.",
          "Gather feedback on work done.",
          "Brainstorm solutions for upcoming tasks."
        ]
      },
      {
        period: "deepFocusCodingAfternoon",
        startTime: "15:00",
        endTime: "17:00",
        task: "Deep focus coding: Continue working on important implementations.",
        description: [
          "Finalize remaining high-priority tasks.",
          "Ensure code is functioning as intended.",
          "Push code for review."
        ]
      },
      {
        period: "wrapUp",
        startTime: "17:00",
        endTime: "17:30",
        task: "Wrap up tasks and prepare updates for the evening meeting.",
        description: [
          "Document progress made during the day.",
          "Prepare notes for the meeting.",
          "Check in with juniors on their progress."
        ]
      },
      {
        period: "eveningMeeting",
        startTime: "17:30",
        endTime: "18:30",
        task: "Evening meeting: Share updates and discuss blockers or future tasks.",
        description: [
          "Present updates on tasks.",
          "Discuss any blockers faced during the day.",
          "Outline tasks for the next day."
        ]
      },
      {
        period: "testData",
        startTime: "17:30",
        endTime: "05:30",
        task: "Evening meeting: Share updates and discuss blockers or future tasks.",
        description: [
          "Present updates on tasks.",
          "Discuss any blockers faced during the day.",
          "Outline tasks for the next day."
        ]
      }
    ]
  };

function Clock(): JSX.Element {
  const [time, setTime] = useState<Date>(new Date());
  const [showTasks, setShowTasks] = useState<boolean>(true);
  const [timeToNextTask, setTimeToNextTask] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      setTimeToNextTask(calculateTimeToNextTask(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedPreference = localStorage.getItem('showTasks');
    if (storedPreference !== null) {
      setShowTasks(storedPreference === 'true');
    }
  }, []);

  const toggleTasks = (): void => {
    const newShowTasks = !showTasks;
    setShowTasks(newShowTasks);
    localStorage.setItem('showTasks', newShowTasks.toString());
  };

  const parseTime = (timeString: string): { hour: number; minute: number } => {
    const [hour, minute] = timeString.split(':').map(Number);
    return { hour, minute };
  };

  const isWithinTimeRange = (
    currentHour: number,
    currentMinute: number,
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
  ): boolean => {
    const currentTime = currentHour * 60 + currentMinute;
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime < endTime;
    } else {
      return currentTime >= startTime || currentTime < endTime;
    }
  };

  const getCurrentTask = (): { task: string; description: string[] } => {
    const currentHour = time.getHours();
    const currentMinute = time.getMinutes();

    for (const task of taskSchedule.tasks) {
      const { hour: startHour, minute: startMinute } = parseTime(task.startTime);
      const { hour: endHour, minute: endMinute } = parseTime(task.endTime);

      if (isWithinTimeRange(currentHour, currentMinute, startHour, startMinute, endHour, endMinute)) {
        return { task: task.task, description: task.description };
      }
    }

    return { task: "No task scheduled for this time.", description: [] };
  };

  const calculateTimeToNextTask = (now: Date): string => {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const currentTime = currentHour * 3600 + currentMinute * 60 + currentSecond;

    let nextTask: Task | null = null;
    let minDiff = Infinity;

    for (const task of taskSchedule.tasks) {
      const { hour: startHour, minute: startMinute } = parseTime(task.startTime);
      let startTime = startHour * 3600 + startMinute * 60;

      if (startTime <= currentTime) {
        startTime += 24 * 3600; // Add 24 hours if the start time is earlier today
      }

      const diff = startTime - currentTime;

      if (diff < minDiff) {
        minDiff = diff;
        nextTask = task;
      }
    }

    if (nextTask) {
      const hours = Math.floor(minDiff / 3600);
      const minutes = Math.floor((minDiff % 3600) / 60);
      const seconds = minDiff % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} until ${nextTask.task}`;
    }

    return '';
  };

  const currentTask = getCurrentTask();

  return (
    <div>
      <div className="glass-card clock-container" onClick={toggleTasks}>
        <div className='clock-day'>
          <span>{time.toLocaleDateString([], { weekday: 'short' })}</span>
        </div>
        <div className="clock-right">
          <p className='clock-date'>
            {time.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
          <p className='clock-time'>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <AnimatePresence>
        {showTasks && (
          <motion.div
            className="task-container glass-card"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}>
            <h2>{currentTask.task}</h2>
            <ul>
              {currentTask.description.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <p className="next-task-time">{timeToNextTask}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Clock;
