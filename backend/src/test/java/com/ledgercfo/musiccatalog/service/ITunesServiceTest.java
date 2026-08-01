package com.ledgercfo.musiccatalog.service;

import com.ledgercfo.musiccatalog.dto.AlbumDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class ITunesServiceTest {

    @Autowired
    private ApplicationContext context;

    @Autowired
    private ITunesService iTunesService;

    @Test
    void contextLoads() {
        assertNotNull(context);
        assertNotNull(iTunesService);
    }
    
    // Proper testing of ITunesService requires mocking the WebClient or using MockWebServer,
    // which is beyond basic unit testing. This test ensures the bean and cache proxies 
    // are correctly instantiated by Spring.
}
