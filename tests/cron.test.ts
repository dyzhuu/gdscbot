import { eventsCronJob, syncCronJob } from '../src/services/cron';

import calendar from '../src/services/googleCalendarAPI';
import announceEvent from '../src/scheduledMessages/announceEvent';
import weeklySync from '../src/scheduledMessages/weeklySync';
import Logging from '../src/library/Logging';
import { calendar_v3 } from 'googleapis';

jest.mock('../src/scheduledMessages/announceEvent'); // Mock announceEvent function
jest.mock('../src/scheduledMessages/weeklySync'); // Mock announceEvent function
jest.mock('../src/library/Logging', () => ({
  error: jest.fn()
}));

describe('eventsCronJob', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test case
  });

  it('should call announceEvent for each event returned by calendar.getNextEvents', async () => {
    // Arrange
    const mockEvents = [
      // create some mock events
      {
        summary: 'Test event 1',
        description: 'Test event 1 description',
        start: {
          dateTime: new Date().toISOString()
        },
        end: {
          dateTime: new Date().toISOString()
        },
        location: 'Test event 1 location'
      },
      {
        summary: 'Test event 2',
        description: 'Test event 2 description',
        start: {
          dateTime: new Date().toISOString()
        },
        end: {
          dateTime: new Date().toISOString()
        },
        location: 'Test event 2 location'
      }
    ];

    const getNextEventsMock = jest
      .spyOn(calendar, 'getNextEvents')
      .mockResolvedValue(mockEvents);

    // Act
    await eventsCronJob();

    // Assert
    expect(getNextEventsMock).toHaveBeenCalled();
    expect(announceEvent).toHaveBeenCalledTimes(mockEvents.length);
    mockEvents.forEach((event) => {
      expect(announceEvent).toHaveBeenCalledWith(event);
    });
  });

  it('should handle empty events list', async () => {
    // Arrange
    const emptyEvents: calendar_v3.Schema$Event[] = [];
    jest.spyOn(calendar, 'getNextEvents').mockResolvedValue(emptyEvents);

    // Act
    await eventsCronJob();

    // Assert
    expect(announceEvent).not.toHaveBeenCalled();
    expect(Logging.error).not.toHaveBeenCalled();
  });
});

describe('syncCronJob', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test case
  });

  it('should call set the scheduled time to the correct time', async () => {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1);
    const expectedTime = new Date(startTime.getTime());

    //Arrange
    startTime.setDate(startTime.getDate() - 7 * 50); // set date to 50 weeks ago (the weekday should be the same)
    const mockEvent = {
      summary: '💻 Weekly Sync',
      description: 'description',
      start: {
        dateTime: startTime.toISOString()
      },
      end: {
        dateTime: startTime.toISOString()
      },
      location: 'location'
    };
    const getWeeklySyncMock = jest
      .spyOn(calendar, 'getWeeklySync')
      .mockResolvedValue(mockEvent);

    //Act
    await syncCronJob();

    //Assert
    expect(getWeeklySyncMock).toHaveBeenCalled();
    expect(weeklySync).toHaveBeenCalledWith(mockEvent, expectedTime);
  });
});
