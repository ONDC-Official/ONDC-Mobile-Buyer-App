package org.ondc.buyer;

import com.facebook.react.ReactActivity;
import in.juspay.hypersdkreact.HyperSdkReactModule;


public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Buyer";
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    HyperSdkReactModule.onRequestPermissionsResult(requestCode, permissions, grantResults);
  }
}