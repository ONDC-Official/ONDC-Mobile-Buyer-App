package org.ondc.buyer;

import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;
import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;

public class SSLPinningFactory implements OkHttpClientFactory {
    private static String hostname = "sslpinning.com";

    public OkHttpClient createNewNetworkModuleClient() {

        CertificatePinner certificatePinner = new CertificatePinner.Builder()
                .add("ref-app-buyer-staging-v2.ondc.org", "sha256/8b7tq7gY8RIktc5roDoMhqO2k76HRB4dwEyCtGCszTA=")
                .add("ref-app-buyer-staging-v2.ondc.org", "sha256/jQJTbIh0grw0/1TkHSumWb+Fs0Ggogr621gT3PvPKG0=")
                .add("buyer-app-preprod-v2.ondc.org", "sha256/JBUvs7gTjbPwk77xx05z3qlEhtORD+QRB8I8kubsEzE=")
                .add("buyer-app-preprod-v2.ondc.org", "sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=")
                .build();

        OkHttpClient.Builder clientBuilder = OkHttpClientProvider.createClientBuilder();
        return clientBuilder.certificatePinner(certificatePinner).build();
    }
}
