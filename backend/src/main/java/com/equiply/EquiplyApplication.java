package com.equiply;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.modulith.Modulith;

@Modulith
@SpringBootApplication
public class EquiplyApplication {

    public static void main(String[] args) {
        SpringApplication.run(EquiplyApplication.class, args);
    }
}
