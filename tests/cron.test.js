"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("../src/services/cron");
const googleCalendarAPI_1 = __importDefault(require("../src/services/googleCalendarAPI"));
const announceEvent_1 = __importDefault(require("../src/scheduledMessages/announceEvent"));
const weeklySync_1 = __importDefault(require("../src/scheduledMessages/weeklySync"));
const Logging_1 = __importDefault(require("../src/library/Logging"));
jest.mock('../src/scheduledMessages/announceEvent'); // Mock announceEvent function
jest.mock('../src/scheduledMessages/weeklySync'); // Mock announceEvent function
jest.mock('../src/library/Logging', () => ({
    error: jest.fn()
}));
describe('eventsCronJob', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test case
    });
    it('should call announceEvent for each event returned by calendar.getNextEvents', () => __awaiter(void 0, void 0, void 0, function* () {
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
            .spyOn(googleCalendarAPI_1.default, 'getNextEvents')
            .mockResolvedValue(mockEvents);
        // Act
        yield (0, cron_1.eventsCronJob)();
        // Assert
        expect(getNextEventsMock).toHaveBeenCalled();
        expect(announceEvent_1.default).toHaveBeenCalledTimes(mockEvents.length);
        mockEvents.forEach((event) => {
            expect(announceEvent_1.default).toHaveBeenCalledWith(event);
        });
    }));
    it('should handle empty events list', () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const emptyEvents = [];
        jest.spyOn(googleCalendarAPI_1.default, 'getNextEvents').mockResolvedValue(emptyEvents);
        // Act
        yield (0, cron_1.eventsCronJob)();
        // Assert
        expect(announceEvent_1.default).not.toHaveBeenCalled();
        expect(Logging_1.default.error).not.toHaveBeenCalled();
    }));
});
describe('syncCronJob', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test case
    });
    it('should call set the scheduled time to the correct time', () => __awaiter(void 0, void 0, void 0, function* () {
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
            .spyOn(googleCalendarAPI_1.default, 'getWeeklySync')
            .mockResolvedValue(mockEvent);
        //Act
        yield (0, cron_1.syncCronJob)();
        //Assert
        expect(getWeeklySyncMock).toHaveBeenCalled();
        expect(weeklySync_1.default).toHaveBeenCalledWith(mockEvent, expectedTime);
    }));
});
