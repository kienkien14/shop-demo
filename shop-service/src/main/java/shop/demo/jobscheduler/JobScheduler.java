package shop.demo.jobscheduler;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import shop.demo.entity.Bill;
import shop.demo.entity.BillItem;
import shop.demo.repository.BillRepo;
import shop.demo.repository.UserRepo;
import shop.demo.service.EmailService;

@Component
public class 	JobScheduler {
	@Autowired
	UserRepo userRepo;

	@Autowired
	BillRepo billRepo;

	@Autowired
	EmailService emailService;

	// Lên lịch quét 5 phút 1 lần, xem có đơn hàng mới ko, thì gửi mặc định về tài
	// khoản email của mình,
	// (Đơn hàng mới là ngày tạo > ngày hiện tại - 5 phút )
	// gợi ý: Viết hàm jpql tìm bill theo buyDate > :date
	@Scheduled(fixedDelay = 1000 * 60 * 30)
	@Transactional
	public void sendAdminEmail() {
		// lay gio hien tai
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.MINUTE, -30); // tim bill dc tao trong 5p trc do
		Date date = cal.getTime();
		// lay ds bills co ngay tao 5 phut trc do,thong qua searchByDate
		List<Bill> bills = billRepo.searchByDate(date);

		for (Bill b : bills) {
			System.out.println("Bill ID: " + b.getId());
			emailService.sendBill(b.getUser().getEmail(), b.getUser().getName(), b.getBillItems());
		}
	}
	
//	public void sendAdminEmail2(String email, String name) {
//			emailService.sendEmail(email, "Đơn hàng của bạn đã đặt thành công !", "Xin chào! " + name);
//		}

	public void newPassword(String email, String name, String password) {
		emailService.sendEmail(email, "Chào! " + name, "Mật khẩu mới của bạn là: " + password);
	}
	
	public void sendPdf() throws FileNotFoundException {
		emailService.sendEmailwithPdf("kienkien1401@gmail.com", "Thống kê mua hàng" , "Các sản phẩm bạn đã mua" );
	}

	public void sendExcel() throws FileNotFoundException {
		emailService.sendEmailwithExcel("kienkien1401@gmail.com", "Thống kê đơn hàng" , "File thống kê sản phẩm của tháng" );
	}

	@Async
	public void createFileExcel() throws IOException {
		// Create header row
		Workbook workbook = new XSSFWorkbook();

		Sheet sheet = workbook.createSheet("thongKeExcel");
		sheet.setColumnWidth(0, 6000);
		sheet.setColumnWidth(1, 6000);
		sheet.setColumnWidth(2, 6000);

		Row header = sheet.createRow(0);

		CellStyle headerStyle = workbook.createCellStyle();
		headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
		headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		XSSFFont font = ((XSSFWorkbook) workbook).createFont();
		font.setFontName("Arial");
		font.setFontHeightInPoints((short) 16);
		font.setBold(true);
		headerStyle.setFont(font);

		Cell headerCell = header.createCell(0);
		headerCell.setCellValue("Quantity");
		headerCell.setCellStyle(headerStyle);

		headerCell = header.createCell(1);
		headerCell.setCellValue("Month");
		headerCell.setCellStyle(headerStyle);

		headerCell = header.createCell(2);
		headerCell.setCellValue("Year");
		headerCell.setCellStyle(headerStyle);

		//viết nội dung
		CellStyle style = workbook.createCellStyle();
		style.setWrapText(true);

		List<Object[]> res = billRepo.thongKeBill();
		int rowNum = 2;
		for(Object[] rowData : res) {
			Row row = sheet.createRow(rowNum);
			for(int i = 0; i < rowData.length; i++) {
				Cell cell = row.createCell(i);
				cell.setCellValue(String.valueOf(rowData[i]));
				cell.setCellStyle(style);
			}
			rowNum++;
		}

		// Luu lai
		File currDir = new File(".");
		String path = currDir.getAbsolutePath();
		String fileLocation = path.substring(0, path.length() - 1) + "temp.xlsx";

		FileOutputStream outputStream = new FileOutputStream(fileLocation);
		workbook.write(outputStream);
		workbook.close();
	}
}