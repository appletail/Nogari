package me.nogari.nogari;

import static org.hibernate.id.enhanced.StandardOptimizerDescriptor.*;

import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.jasypt.registry.AlgorithmRegistry;
import org.jasypt.salt.StringFixedSaltGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;

import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@Slf4j
class NogariApplicationTests {

	@Test
	void contextLoads() {
	}

	public static final String JASYPT_STRING_ENCRYPTOR = "jasyptStringEncryptor";

	// 복호화 키(jasypt.encryptor.password)는 Application 실행 시 외부 env 통해주입받음
	// Jar : Djasypt.encryptor.password=jasypt_password.!
	@Value("{jasypt.encryptor.password}") private String ENCRYPT_KEY;
	@Value("{jasypt.encryptor.algorithm}") private String ENCRYPT_ALGORITHM;

	@Bean(JASYPT_STRING_ENCRYPTOR)
	@Test
	public void encryptSimpleTest() {

		StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
		SimpleStringPBEConfig config = new SimpleStringPBEConfig();

		config.setPassword(ENCRYPT_KEY);											// 암호화할 때 사용하는 키
		config.setAlgorithm("PBEWithMD5AndTripleDES");
		config.setKeyObtentionIterations("1000");									// 반복할 해싱 회수 (default)
		config.setPoolSize("1");													// 인스턴스 pool
		config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");	// AES 사용 시 설정필수 : salt 생성방식 (default0
		config.setStringOutputType("base64");										// 인코딩 방식
		encryptor.setConfig(config);

		for(int i=0; i<3;i++){
			String str = "testString";
			String encStr = encryptor.encrypt(str);
			String decStr = encryptor.decrypt(encStr);

			System.out.println(str);
			System.out.println(encStr);
			System.out.println(decStr);
			System.out.println("------------------");
		}
	}

}
