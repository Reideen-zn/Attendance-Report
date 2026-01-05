package com.attendance.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
                .title("Attendance Report API")
                .description("API for managing reports.")
                .version("1.0")
                .contact(contact())
                .license(apiLicense());
    }

    private License apiLicense() {
        return new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/mit-license.php");
    }

    private Contact contact() {
        return new Contact()
                .name("Kalenik Ilya")
                .email("ila35538@gmail.com");
    }
}