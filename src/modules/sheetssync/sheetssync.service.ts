import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { GoogleAuth, JWT } from "google-auth-library";
import { sheets_v4, google } from "googleapis";
import * as path from "node:path";
import { SyncWithSheetsEnum } from "src/common/enums/sync-with-sheets-event.enum";
import { UpdateUsersDataEvent } from "src/common/interfaces/update-userdata-event";

@Injectable()
export class SheetssyncService implements OnModuleInit {
  private readonly logger = new Logger(SheetssyncService.name);
  private sheets!: sheets_v4.Sheets;
  private spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  async onModuleInit() {
    const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS as string;
    if (!this.spreadsheetId || !keyFilePath) {
      throw new Error('GOOGLE_SHEET_ID o GOOGLE_APPLICATION_CREDENTIALS faltan');
    }

    const auth = new GoogleAuth({
      keyFile: path.resolve(process.cwd(), keyFilePath),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = (await auth.getClient()) as JWT;   // ← async

    this.sheets = google.sheets({ version: 'v4', auth: authClient });

    this.logger.log('Google Sheets listo');
  }

@OnEvent(SyncWithSheetsEnum.APPEND_ROW)
  async appendRow({sheet, values}: UpdateUsersDataEvent) {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${sheet}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] },
    });
  }
}
