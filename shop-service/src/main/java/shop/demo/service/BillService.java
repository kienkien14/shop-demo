package shop.demo.service;

import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import shop.demo.dto.BillDTO;
import shop.demo.dto.BillItemDTO;
import shop.demo.dto.PageDTO;
import shop.demo.dto.SearchDTO;
import shop.demo.entity.Bill;
import shop.demo.entity.BillItem;
import shop.demo.entity.Product;
import shop.demo.entity.User;
import shop.demo.jobscheduler.JobScheduler;
import shop.demo.repository.BillItemRepo;
import shop.demo.repository.BillRepo;
import shop.demo.repository.ProductRepo;
import shop.demo.repository.UserRepo;

import javax.mail.MessagingException;
import javax.persistence.NoResultException;
import javax.transaction.Transactional;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public interface BillService {
    void create(BillDTO billDTO);

    void update(BillDTO billDTO);

    void delete(int id);

    BillDTO getById(int id);

    PageDTO<BillDTO> search(SearchDTO searchDTO);

    List<String> statistic() throws IOException;

    void createPdfAll(OutputStream outputStream) throws DocumentException, FileNotFoundException, MessagingException;

    void createPdfId(OutputStream outputStream, int id)
            throws DocumentException, FileNotFoundException, MessagingException;

}

@Service
class BillServiceImple implements BillService {
    @Autowired
    BillRepo billRepo;

    @Autowired
    BillItemRepo billItemRepo;

    @Autowired
    UserRepo userRepo;

    @Autowired
    ProductRepo productRepo;

    @Autowired
    JobScheduler jobScheduler;

        @Override
        @Transactional
        public void create(BillDTO billDTO) {
            User user = userRepo.findById(billDTO.getUser().getId()).orElseThrow(NoResultException::new);

            Bill bill = new Bill();
            bill.setUser(user);

            List<BillItem> billItems = new ArrayList<>();

            for (BillItemDTO billItemDTO : billDTO.getBillItems()) {
                BillItem billItem = new BillItem();
                billItem.setBill(bill);
                billItem.setProduct(
                        productRepo.findById(billItemDTO.getProduct().getId()).orElseThrow(NoResultException::new));

                int quantity = billItemDTO.getQuantity();
                double productPrice = billItem.getProduct().getPrice();
                billItem.setPrice(quantity * productPrice); // Tính giá tự động dựa trên Quantity và giá của sản phẩm
                billItem.setQuantity(quantity);

                billItems.add(billItem);
            }

            bill.setBillItems(billItems);
            //
            billRepo.save(bill);
        }

    @Override
    @Transactional
    public void update(BillDTO billDTO) {
        User user = userRepo.findById(billDTO.getUser().getId()).orElseThrow(NoResultException::new);
        Bill bill = billRepo.findById(billDTO.getId()).orElseThrow(NoResultException::new);
        bill.setUser(user);

        List<BillItem> billItemList = new ArrayList<>();

        for (BillItemDTO billItemDTO : billDTO.getBillItems()) {

            BillItem billItem =
                    billItemRepo.findById(billItemDTO.getId()).orElseThrow(NoResultException::new);

            Product newProduct = productRepo.findById(billItemDTO.getProduct().getId()).orElseThrow(NoResultException::new);
            billItem.setProduct(newProduct);

            billItem.setPrice(billItemDTO.getPrice());
            billItem.setQuantity(billItemDTO.getQuantity());

            billItemList.add(billItem);

        }
        bill.getBillItems().clear();
        bill.getBillItems().addAll(billItemList);

        billRepo.save(bill);
    }

    @Override
    @Transactional
    public void delete(int id) {
        billRepo.deleteById(id);
    }

    public PageDTO<BillDTO> search(SearchDTO searchDTO) {
        Pageable pageable = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize());

        Page<Bill> pageRS = billRepo.findAll(pageable);

        PageDTO<BillDTO> pageDTO = new PageDTO<>();
        pageDTO.setTotalPages(pageRS.getTotalPages());
        pageDTO.setTotalElements(pageRS.getTotalElements());

        // java 8 : lambda, stream
        List<BillDTO> billDTOs = pageRS.get().map(b -> new ModelMapper().map(b, BillDTO.class))
                .collect(Collectors.toList());

        pageDTO.setContents(billDTOs);// set vao pagedto
        return pageDTO;
    }

    @Override
    public BillDTO getById(int id) { // java8, optinal
        Bill bill = billRepo.findById(id).orElseThrow(NoResultException::new);// java8 lambda
        for (BillItem billItem : bill.getBillItems()) {
            String product = billItem.getProduct().getName();
            int quantity = billItem.getQuantity();
            double price = billItem.getPrice();
            String listBill = "Product: " + product + ", Quantity: " + quantity + ", Price: " + price;
            System.out.println(listBill.toString());
        }
        return new ModelMapper().map(bill, BillDTO.class);
    }

    @Override
    public List<String> statistic() throws IOException {
        jobScheduler.createFileExcel();
        //excel
        jobScheduler.sendExcel();
        //gui pdf
//        try {
//            jobScheduler.sendPdf();
//        } catch (FileNotFoundException e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
        List<Object[]> obj = billRepo.thongKeBill();

        List<String> list = new ArrayList<>();

        for (Object[] arr : obj) {
            String detail = String.valueOf(arr[0]) + " Đơn đã được đặt trong tháng " + String.valueOf(arr[1]) + " năm "
                    + String.valueOf(arr[2]);

            list.add(detail);
        }

        return list;
    }

    @Override
    @Transactional
    public void createPdfId(OutputStream outputStream, int id)
            throws DocumentException, FileNotFoundException, MessagingException {
        Document document = new Document();
        PdfWriter.getInstance(document, outputStream);

        document.open();

        Font font = FontFactory.getFont(FontFactory.COURIER, 16, BaseColor.BLACK);

        Bill bill = billRepo.findById(id).orElseThrow(NoResultException::new);
        Paragraph paragraph = new Paragraph("", font);

        for (BillItem billItem : bill.getBillItems()) {
            String product = billItem.getProduct().getName();
            int quantity = billItem.getQuantity();
            double price = billItem.getPrice();
            String listBill = "Product: " + product + ", Quantity: " + quantity + ", Price: " + price;

            Chunk chunk = new Chunk(listBill, font);
            paragraph.add(chunk);
            paragraph.add(Chunk.NEWLINE);
        }
        document.add(paragraph);
        document.close();
    }

    @Override
    public void createPdfAll(OutputStream outputStream)
            throws DocumentException, FileNotFoundException, MessagingException {
        Document document = new Document();
        PdfWriter.getInstance(document, outputStream);

        document.open();

        Font font = FontFactory.getFont(FontFactory.COURIER, 16, BaseColor.BLACK);

        List<Object[]> obj = billRepo.thongKeBill();

        Paragraph paragraph = new Paragraph("", font);

        for (Object[] arr : obj) {
            String listBill = (String.valueOf(arr[0]) + " Don da duoc dat trong thang " + String.valueOf(arr[1])
                    + " nam " + String.valueOf(arr[2]));
            Chunk chunk = new Chunk(listBill, font);
            paragraph.add(chunk);
            paragraph.add(Chunk.NEWLINE);
        }

        document.add(paragraph);
        document.close();

    }
}
