package org.ondc.buyer;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

public class RootCheckModule extends ReactContextBaseJavaModule {

    public RootCheckModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RootCheck";
    }

    @ReactMethod
    public void isMagiskPresent(Promise promise) {
        boolean isMagiskPresent = checkForMagisk();
        promise.resolve(isMagiskPresent);
    }

    private boolean checkForMagisk() {
        // Implement your logic to detect Magisk
        String[] paths = {
                "/sbin/magisk",
                "/sbin/magiskhide",
                "/sbin/.magisk",
                "/cache/magisk.log",
                "/data/magisk"
        };

        for (String path : paths) {
            if (new File(path).exists()) {
                return true;
            }
        }

        return false;
    }
}
