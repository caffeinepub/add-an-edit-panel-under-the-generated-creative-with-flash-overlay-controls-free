import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  // Initialize access control state and mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Logo = {
    name : Text;
    logo : Storage.ExternalBlob;
  };

  type Color = {
    hex : Text;
    name : Text;
  };

  type Reference = {
    name : Text;
    reference : Storage.ExternalBlob;
  };

  type BrandKit = {
    name : Text;
    logo : ?Logo;
    colors : [Color];
    references : [Reference];
  };

  module BrandKit {
    public func compare(a : BrandKit, b : BrandKit) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  let brandKits = Map.empty<Principal, BrandKit>();

  // Core logic for brand kit management
  public query ({ caller }) func getCallerBrandKit() : async ?BrandKit {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    brandKits.get(caller);
  };

  public query ({ caller }) func getBrandKit(user : Principal) : async ?BrandKit {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own kit");
    };
    brandKits.get(user);
  };

  public shared ({ caller }) func saveCallerBrandKit(brandKit : BrandKit) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    brandKits.add(caller, brandKit);
  };

  // Helpers and validations - made private as it's a utility function
  private func validateColorHex(hex : Text) : Bool {
    hex.contains(#char '#') and hex.size() == 7;
  };

  public query ({ caller }) func checkBrandKitExists(user : Principal) : async Bool {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own brand kit existence");
    };
    brandKits.containsKey(user);
  };

  public shared ({ caller }) func clearLogo() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear logos for themselves");
    };
    switch (brandKits.get(caller)) {
      case (null) {
        Runtime.trap("Brand kit not found");
      };
      case (?brandKit) {
        let newBrandKit = {
          brandKit with
          logo = null;
        };
        brandKits.add(caller, newBrandKit);
      };
    };
  };

  public shared ({ caller }) func clearReferences() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear references for themselves");
    };
    switch (brandKits.get(caller)) {
      case (null) {
        Runtime.trap("Brand kit not found");
      };
      case (?brandKit) {
        let newBrandKit = {
          brandKit with
          references = [];
        };
        brandKits.add(caller, newBrandKit);
      };
    };
  };

  public shared ({ caller }) func clearColors() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear colors for themselves");
    };
    switch (brandKits.get(caller)) {
      case (null) {
        Runtime.trap("Brand kit not found");
      };
      case (?brandKit) {
        let newBrandKit = {
          brandKit with
          colors = [];
        };
        brandKits.add(caller, newBrandKit);
      };
    };
  };
};
