package com.ledgercfo.musiccatalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MusiccatalogApplication {

	public static void main(String[] args) {
		SpringApplication.run(MusiccatalogApplication.class, args);
	}

}
