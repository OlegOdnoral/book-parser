import { BookParserClassInput, BookParser } from './book-parser.controller';
import { environment } from '../../environments/environment';

describe('book-parser.controller.ts', () => {

    beforeEach(async() => {

        const bookParserConfig: BookParserClassInput = {
            queueName: environment.rabbitQueueName,
            rabbitUri: environment.rabbitUri,
            rabbitUser: environment.rabbitUser,
            rabbitPassword: environment.rabbitPassword,
          };
          const bookParser = new BookParser(bookParserConfig);

      })

})