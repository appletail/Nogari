package me.nogari.nogari.config;

import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@EnableEncryptableProperties
@Configuration
public class JasyptConfig {
	public static final String JASYPT_STRING_ENCRYPTOR = "jasyptStringEncryptor";

	// 복호화 키(jasypt.encryptor.password)는 Application 실행 시 외부 env 통해주입받음
	// Jar : Djasypt.encryptor.password=jasypt_password.!
	@Value("{jasypt.encryptor.password}") private String ENCRYPT_KEY;
	@Value("{jasypt.encryptor.algorithm}") private String ENCRYPT_ALGORITHM;

	@Bean(JASYPT_STRING_ENCRYPTOR)
	public StringEncryptor stringEncryptor() {

		//org.jasypt
		// StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
		// encryptor.setPassword("somePassword");
		// encryptor.setAlgorithm("PBEWithMD5AndDES");
		// encryptor.setSaltGenerator(new StringFixedSaltGenerator("someFixedSalt"));
		// String str = "testString";
		// String encStr = encryptor.encrypt(str);
		// String decStr = encryptor.decrypt(encStr);
		// log.debug("str : {}, encStr : {}, decStr : {}", str, encStr, decStr);

		// com.github.ulisesbocchio
		StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
		SimpleStringPBEConfig config = new SimpleStringPBEConfig();

		config.setPassword(ENCRYPT_KEY);											// 암호화할 때 사용하는 키
		// config.setAlgorithm("PBEWITHHMACSHA512ANDAES_256");							// 알고리즘 설정
		config.setAlgorithm(ENCRYPT_ALGORITHM);
		config.setKeyObtentionIterations("1000");									// 반복할 해싱 회수 (default)
		config.setPoolSize("1");													// 인스턴스 pool
		config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");	// AES 사용 시 설정필수 : salt 생성방식 (default0
		// config.setIvGeneratorClassName("org.jasypt.iv.RandomIvGenerator");			// AES 사용 시 설정필수
		config.setStringOutputType("base64");										// 인코딩 방식
		encryptor.setConfig(config);

		log.info("Jasypt Config Completed");

		return encryptor;
	}






}
