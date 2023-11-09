package shop.demo.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import shop.demo.entity.BillItem;

@Service
public class EmailService {
	@Autowired
	private JavaMailSender javaMailSender;

	@Autowired
	private SpringTemplateEngine templateEngine;

	public void sendEmail(String to, String subject, String body) {
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());
		try {
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(body, true);
			helper.setFrom("kienkien1401@gmail.com");

			javaMailSender.send(message);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	public void sendBill(String to, String name, List<BillItem> billItems) {
		String subject = "Đơn hàng của bạn đã đặt thành công !";
		// load template email with content
		Context context = new Context();
		context.setVariable("name", name);
		context.setVariable("billItems", billItems);

		String body = templateEngine.process("email/sendBill.html", context);
		sendEmail(to, subject, body);
	}

	public void sendEmailwithPdf(String to, String subject, String body) {
		MimeMessage message = javaMailSender.createMimeMessage();
		try {
			MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(body, true);
			helper.setFrom("kienkien1401@gmail.com");

			File attachment = ResourceUtils.getFile("D:\\JavaWeb\\ThucHanhJavaWeb\\project3\\2023-08-08_Bill_10.pdf");
            helper.addAttachment(attachment.getName(), attachment);
			
			javaMailSender.send(message);
		} catch (MessagingException |FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	public void sendEmailwithExcel(String to, String subject, String body) {
		MimeMessage message = javaMailSender.createMimeMessage();
		try {
			MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(body, true);
			helper.setFrom("kienkien1401@gmail.com");

			File attachment = ResourceUtils.getFile("D:\\BackEnd\\ThucHanhJavaWeb\\project3\\temp.xlsx");
			helper.addAttachment(attachment.getName(), attachment);

			javaMailSender.send(message);
		} catch (MessagingException |FileNotFoundException e) {
			e.printStackTrace();
		}
	}
}
