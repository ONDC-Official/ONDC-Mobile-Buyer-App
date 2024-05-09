#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <TrustKit/TrustKit.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ONDC Reference Buyer App";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  [FIRApp configure];
  NSDictionary *trustKitConfig =
    @{
      kTSKSwizzleNetworkDelegates: @YES,
      kTSKPinnedDomains: @{
          @"ref-app-buyer-staging-v2.ondc.org" : @{
              kTSKIncludeSubdomains: @YES,
              kTSKEnforcePinning: @YES,
              kTSKDisableDefaultReportUri: @YES,
              kTSKPublicKeyHashes : @[
                @"8b7tq7gY8RIktc5roDoMhqO2k76HRB4dwEyCtGCszTA=",
                @"jQJTbIh0grw0/1TkHSumWb+Fs0Ggogr621gT3PvPKG0="
              ],
          },
          @"buyer-app-preprod-v2.ondc.org" : @{
              kTSKIncludeSubdomains: @YES,
              kTSKEnforcePinning: @YES,
              kTSKDisableDefaultReportUri: @YES,
              kTSKPublicKeyHashes : @[
                @"JBUvs7gTjbPwk77xx05z3qlEhtORD+QRB8I8kubsEzE=",
                @"47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
              ],
          }
      }};
  [TrustKit initSharedInstanceWithConfiguration:trustKitConfig];


  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
