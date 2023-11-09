package shop.demo.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.DocumentException;

import shop.demo.dto.BillDTO;
import shop.demo.dto.PageDTO;
import shop.demo.dto.ResponseDTO;
import shop.demo.dto.SearchDTO;
import shop.demo.service.BillService;

@RestController
@RequestMapping("/admin/bill")
public class BillController {

	@Autowired // DI: dependency inject
	BillService billService;

	final String UPLOAD_FOLDER = "D:\\BackEnd\\ThucHanhJavaWeb\\project3\\";

	@GetMapping("/pdf/all")
	public void pdfThongKe(HttpServletResponse response)
			throws IOException, DocumentException, MessagingException {
		Date currentDate = new Date();
		// Format the date as "yyyy-MM-dd"
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String formattedDate = dateFormat.format(currentDate);

		File file = new File(UPLOAD_FOLDER + formattedDate + ".pdf");
		FileOutputStream fileOutputStream = new FileOutputStream(file);

		billService.createPdfAll(fileOutputStream);
		Files.copy(file.toPath(), response.getOutputStream());
	}

	@GetMapping("/pdf/{id}")
	public void pdfThongKeId(@PathVariable("id") int id, HttpServletResponse response)
			throws IOException, DocumentException, MessagingException {
		Date currentDate = new Date();
		// Format the date as "yyyy-MM-dd"
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String formattedDate = dateFormat.format(currentDate);
		  String filename = formattedDate + "_Bill_" + id + ".pdf";
		
		File file = new File(UPLOAD_FOLDER + filename );
		FileOutputStream fileOutputStream = new FileOutputStream(file);
		
		billService.createPdfId(fileOutputStream, id);
		Files.copy(file.toPath(), response.getOutputStream());
	}

	@PostMapping("/") // gia su: khong upload file
	public ResponseDTO<Void> create(@RequestBody @Valid BillDTO billDTO) {
		billService.create(billDTO);
		return ResponseDTO.<Void>builder().status(200).msg("Create Ok").build();
	}

	@PutMapping("/")
	public ResponseDTO<Void> edit(@RequestBody @Valid BillDTO billDTO) {
		billService.update(billDTO);
		return ResponseDTO.<Void>builder().status(200).msg("Update Ok").build();
	}

	@DeleteMapping("/{id}")
	public ResponseDTO<Void> delete(@PathVariable("id") int id) {
		billService.delete(id);
		return ResponseDTO.<Void>builder().status(200).msg("Delete Ok").build();
	}

	@GetMapping("/{id}")
	public ResponseDTO<BillDTO> get(@PathVariable("id") int id) {
		return ResponseDTO.<BillDTO>builder().status(200).data(billService.getById(id)).build();
	}

	@PostMapping("/search")
	public PageDTO<BillDTO> search(@RequestBody @Valid SearchDTO searchDTO) {
		return billService.search(searchDTO);
	}

	@GetMapping("/statistic")
	public ResponseDTO<List<String>> statistic() throws IOException {
		List<String> billDTOs = billService.statistic();
		return ResponseDTO.<List<String>>builder().status(200).msg("Thống kê theo tháng:").data(billDTOs).build();
	}

}